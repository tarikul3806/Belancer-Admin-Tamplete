import React from "react";
import { pad2 } from "../../features/transaction/utils";

const TransactionPagination = ({
    page,
    setPage,
    limit,
    setLimit,
    showing,
    total,
}) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
                Page {page} • Showing {pad2(showing.start)}–{pad2(showing.end)} of {total}
            </div>
            <div className="flex items-center gap-2">
                <select
                    className="border border-gray-300 rounded-md text-black text-sm px-2 py-1"
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    {[5, 10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                            {n}/page
                        </option>
                    ))}
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
    );
};

export default TransactionPagination;
