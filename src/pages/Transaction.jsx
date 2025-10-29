import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Filter, ChevronDown } from "lucide-react";
import { fetchData } from "../common/axiosInstance";

const ENDPOINT = "/transactions/all";

const pad2 = (n) => String(n).padStart(2, "0");

function formatDateParts(iso) {
    if (!iso) return { date: "—", time: "" };
    const d = new Date(iso);
    if (isNaN(d)) return { date: "—", time: "" };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${pad2(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;

    let hrs = d.getHours();
    const mins = pad2(d.getMinutes());
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    const time = `${pad2(hrs)}:${mins} ${ampm}`;
    return { date, time };
}

const statusClasses = {
    confirmed: "text-green-600",
    success: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
    failed: "text-red-600",
    cancelled: "text-red-600",
};

const Transaction = () => {
    // server-side pagination params
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // filters/sort 
    const [sortBy, setSortBy] = useState("Date Created");
    const [actionFilter, setActionFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // data
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // fetch
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const params = {
                    page,
                    limit,
                    ...(actionFilter ? { transaction_type: actionFilter } : {}),
                    ...(dateFrom ? { date_from: dateFrom } : {}),
                    ...(dateTo ? { date_to: dateTo } : {}),
                };

                const res = await fetchData(ENDPOINT, params);
                const list = Array.isArray(res?.transactions) ? res.transactions : [];
                if (!mounted) return;

                setRows(list);
                setTotal(Number(res?.total ?? list.length));
            } catch (e) {
                setErr(e);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [page, limit, actionFilter, dateFrom, dateTo, sortBy]);

    const showing = useMemo(() => {
        if (!total) return { start: 0, end: 0 };
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, total);
        return { start, end };
    }, [page, limit, total]);

    const toMoney = (n, currency = "USD") => {
        const num = Number(n);
        if (isNaN(num)) return currency === "BDT" ? "৳0.00" : "$0.00";
        const symbol = currency === "BDT" ? "৳" : "$";
        const sign = num < 0 ? "-" : "";
        return `${sign}${symbol}${Math.abs(num).toFixed(2)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Transactions</h1>
                    <p className="text-sm text-gray-500">List of deposits & withdrawals done by Investor</p>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-indigo-600">
                                Latest actions (Showing {pad2(showing.start)} to {pad2(showing.end)} of {total})
                            </span>

                            <button
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setDateFrom(prompt("YYYY-MM-DD", dateFrom) || "")}
                            >
                                <Calendar className="w-4 h-4" />
                                Date from
                            </button>

                            <button
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setDateTo(prompt("YYYY-MM-DD", dateTo) || "")}
                            >
                                <Calendar className="w-4 h-4" />
                                Date to
                            </button>

                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        const value = prompt('Filter action (deposit / withdrawal). Empty = all', actionFilter) || "";
                                        setActionFilter(value.trim().toLowerCase());
                                        setPage(1);
                                    }}
                                >
                                    <Filter className="w-4 h-4" />
                                    Action
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort By:</span>
                            <button
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() =>
                                    setSortBy((prev) => (prev === "Date Created" ? "Amount" : "Date Created"))
                                }
                            >
                                {sortBy}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ref
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && Array.from({ length: limit }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 rounded mb-2" /><div className="h-3 w-16 bg-gray-100 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
                                    <td className="px-6 py-4"><div className="h-3 w-48 bg-gray-200 rounded" /></td>
                                </tr>
                            ))}

                            {!loading && err && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-sm text-red-600">
                                        Failed to load transactions. Check API URL/token and try again.
                                    </td>
                                </tr>
                            )}

                            {!loading && !err && rows.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-6 text-sm text-gray-500">No transactions found.</td>
                                </tr>
                            )}

                            {!loading && !err && rows.map((tx, idx) => {
                                const { date, time } = formatDateParts(tx.created_at);
                                const statusKey = String(tx.status ?? "").toLowerCase();
                                const statusCls = statusClasses[statusKey] ?? "text-gray-600";
                                const action = String(tx.transaction_type ?? "").replace(/\b\w/g, s => s.toUpperCase());
                                const commission = toMoney(tx.commission ?? 0);
                                const signedAmount =
                                    (String(tx.transaction_type).toLowerCase() === "withdrawal" ? -1 : 1) *
                                    Number(tx.amount ?? 0);

                                return (
                                    <tr key={`${tx.transaction_ref}-${idx}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{date}</div>
                                            <div className="text-sm text-gray-500">{time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{action || "—"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-2 text-sm ${statusCls}`}>
                                                <span className="text-xl leading-none">●</span>
                                                <span className="capitalize">{String(tx.status ?? "—")}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{commission}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className={`text-sm font-medium ${signedAmount < 0 ? "text-red-600" : "text-green-600"
                                                    }`}
                                                aria-label={signedAmount < 0 ? "Debit amount" : "Credit amount"}
                                            >
                                                {toMoney(signedAmount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 font-mono">{tx.transaction_ref || "—"}</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Simple pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Page {page} • Showing {pad2(showing.start)}–{pad2(showing.end)} of {total}
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="border border-gray-300 rounded-md text-black text-sm px-2 py-1"
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        >
                            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/page</option>)}
                        </select>
                        <button
                            className="px-3 py-1 border rounded-md text-black text-sm disabled:opacity-50"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-1 border rounded-md text-black text-sm disabled:opacity-50"
                            onClick={() => setPage((p) => (showing.end < total ? p + 1 : p))}
                            disabled={showing.end >= total}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transaction;
