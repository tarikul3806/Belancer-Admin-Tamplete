import React, { useEffect, useMemo, useState } from "react";
import { fetchData } from "../../common/axiosInstance";
import TransactionHeader from "./TransactionHeader";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import TransactionPagination from "./TransactionPagination";

const ENDPOINT = "/transactions/all";

const Transaction = () => {
    // pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // filters/sort
    const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // raw data from server (unfiltered)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // fetch ONCE – server doesn't filter, so we pull everything and filter client-side
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const res = await fetchData(ENDPOINT);
                const list = Array.isArray(res?.transactions) ? res.transactions : [];
                if (!mounted) return;

                setRows(list);
            } catch (e) {
                setErr(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // apply action + date filters on the frontend
    const filteredRows = useMemo(() => {
        if (!Array.isArray(rows)) return [];

        return rows.filter((row) => {
            const created = new Date(row.created_at);
            const createdValid = !Number.isNaN(created.getTime());

            // date from (inclusive)
            if (dateFrom && createdValid) {
                const from = new Date(dateFrom);
                if (!Number.isNaN(from.getTime()) && created < from) {
                    return false;
                }
            }

            // date to (inclusive – end of the day)
            if (dateTo && createdValid) {
                const to = new Date(dateTo);
                if (!Number.isNaN(to.getTime())) {
                    to.setHours(23, 59, 59, 999);
                    if (created > to) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [rows, dateFrom, dateTo]);

    const total = filteredRows.length;

    // for "Showing XX to YY of ZZ"
    const showing = useMemo(() => {
        if (!total) return { start: 0, end: 0 };
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, total);
        return { start, end };
    }, [page, limit, total]);

    // page slice BEFORE sorting
    const pageSlice = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredRows.slice(start, start + limit);
    }, [filteredRows, page, limit]);

    // page-wise sorting (newest/oldest)
    const sortedRows = useMemo(() => {
        const copy = [...pageSlice];

        copy.sort((a, b) => {
            const da = new Date(a.created_at).getTime() || 0;
            const db = new Date(b.created_at).getTime() || 0;

            if (sortBy === "oldest") return da - db; // oldest first
            return db - da; // newest first
        });

        return copy;
    }, [pageSlice, sortBy]);

    return (
        <div className="min-h-screen">
            <div className="mx-auto bg-white rounded-lg shadow-sm">
                <TransactionHeader />
                <TransactionFilters
                    showing={showing}
                    total={total}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setPage={setPage}
                />
                <TransactionTable
                    rows={sortedRows}
                    loading={loading}
                    err={err}
                    limit={limit}
                />
                <TransactionPagination
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    showing={showing}
                    total={total}
                />
            </div>
        </div>
    );
};

export default Transaction;
