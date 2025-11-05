import { useEffect, useMemo, useState } from "react";
import { fetchData } from "../../common/axiosInstance";

const TZ = "Asia/Dhaka";
const TYPE_KEYS = ["deposit", "withdraw", "withdrawal", "payout"];
const STATUS_SUCCESS = new Set(["success"]);

// --- helpers ---
const isCountable = (t) => {
    const rawType = String(t?.transaction_type || "").toLowerCase();
    const okType = TYPE_KEYS.some((k) => rawType.includes(k));
    const rawStatus = String(t?.status || "").toLowerCase();
    const okStatus = STATUS_SUCCESS.has(rawStatus);
    return okType && okStatus;
};

const asDate = (iso) => {
    const d = iso ? new Date(iso) : null;
    return d && !isNaN(d) ? d : null;
};

const ymdTZ = (date, tz = TZ) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
const yearTZ = (date, tz = TZ) =>
    Number(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric" }).format(date));
const monthTZ = (date, tz = TZ) =>
    Number(new Intl.DateTimeFormat("en-CA", { timeZone: tz, month: "2-digit" }).format(date));

// paginate all transactions
async function fetchAllTransactions() {
    const first = await fetchData("/transactions/all", { page: 1, limit: 1000 });
    const total = Number(first?.total || 0);
    const limit = Number(first?.limit || 1000);
    const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));

    let all = Array.isArray(first?.transactions) ? first.transactions : [];
    for (let p = 2; p <= totalPages; p++) {
        const res = await fetchData("/transactions/all", { page: p, limit: 1000 });
        all = all.concat(Array.isArray(res?.transactions) ? res.transactions : []);
    }
    return all;
}

export default function useWithdrawStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true); setError(null);
            try {
                const rows = await fetchAllTransactions();
                if (!mounted) return;
                setItems(rows.filter(isCountable));
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const counts = useMemo(() => {
        const now = new Date();
        const yNow = yearTZ(now);
        const mNow = monthTZ(now);
        const dNow = ymdTZ(now);

        let daily = 0, monthly = 0, yearly = 0, total = 0;

        for (const t of items) {
            const d = asDate(t?.created_at || t?.createdAt || t?.date_created);
            if (!d) continue;

            const y = yearTZ(d), m = monthTZ(d), ymd = ymdTZ(d);
            total += 1;
            if (y === yNow) {
                yearly += 1;
                if (m === mNow) {
                    monthly += 1;
                    if (ymd === dNow) daily += 1;
                }
            }
        }
        return { daily, monthly, yearly, total };
    }, [items]);

    const amounts = useMemo(() => {
        const now = new Date();
        const yNow = yearTZ(now);
        const mNow = monthTZ(now);
        const dNow = ymdTZ(now);

        let daily = 0, monthly = 0, yearly = 0, total = 0;

        for (const t of items) {
            const d = asDate(t?.created_at || t?.createdAt || t?.date_created);
            if (!d) continue;

            const y = yearTZ(d), m = monthTZ(d), ymd = ymdTZ(d);
            const amt = Number(t?.amount || 0);

            total += amt;
            if (y === yNow) {
                yearly += amt;
                if (m === mNow) {
                    monthly += amt;
                    if (ymd === dNow) daily += amt;
                }
            }
        }
        return { daily, monthly, yearly, total };
    }, [items]);

    // same week-over-week trend logic
    const trend = useMemo(() => {
        const now = new Date();
        const end = new Date(now);
        const start = new Date(now); start.setDate(start.getDate() - 7);
        const prevStart = new Date(now); prevStart.setDate(prevStart.getDate() - 14);
        const prevEnd = new Date(now); prevEnd.setDate(prevEnd.getDate() - 7);
        const inRange = (d, a, b) => d >= a && d < b;

        let cur = 0, prev = 0;
        for (const t of items) {
            const d = asDate(t?.created_at || t?.createdAt || t?.date_created);
            if (!d) continue;
            if (inRange(d, start, end)) cur++;
            else if (inRange(d, prevStart, prevEnd)) prev++;
        }
        const pct = prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);
        return { cur, prev, pct };
    }, [items]);

    return { loading, error, counts, amounts, trend };
}

