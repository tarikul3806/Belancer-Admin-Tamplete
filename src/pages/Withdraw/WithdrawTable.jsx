import React from "react";

const currencySymbol = (c) => {
    const map = { BDT: "৳", USD: "$", EUR: "€", GBP: "£", INR: "₹" };
    return map[c] ?? (c || "");
};
const fmtAmount = (amount, currency) => {
    const n = Number(amount ?? 0);
    return `${currencySymbol(currency)} ${n.toFixed(2)}`;
};

const WithdrawTable = ({
    rows,
    loading,
    error,
    activeTab,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    openDetails,
    total,
}) => {
    const hasPrev = page > 1;
    const hasNext = page * itemsPerPage < total;

    const filtered = rows.filter((tx) => {
        if (activeTab === "requests") return tx.status === "pending";
        if (activeTab === "completed")
            return ["success", "cancelled"].includes(tx.status);
        return true;
    });

    return (
        <div className="rounded-lg bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="p-4 text-left font-medium text-gray-600">Wallet Id</th>
                            <th className="p-4 text-left font-medium text-gray-600">Receiver</th>
                            <th className="p-4 text-left font-medium text-gray-600">Amount</th>
                            <th className="p-4 text-left font-medium text-gray-600">Status</th>
                            <th className="p-4" />
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td className="p-4 text-gray-500" colSpan={5}>
                                    Loading…
                                </td>
                            </tr>
                        )}

                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td className="p-4 text-gray-500" colSpan={5}>
                                    No withdrawal requests found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            filtered.map((tx) => {
                                const receiverName =
                                    tx.receiver_account_holder_name ||
                                    tx.receiver_name ||
                                    (tx.wallet_holder ? `User #${tx.wallet_holder}` : "—");
                                return (
                                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-gray-700">{tx.wallet_id ?? "—"}</td>
                                        <td className="p-4 text-gray-700">{receiverName}</td>
                                        <td className="p-4 text-gray-700">
                                            {fmtAmount(tx.amount, tx.currency)}
                                        </td>
                                        <td className="p-4 text-gray-700 capitalize">{tx.status}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => openDetails(tx)}
                                                className="text-sm font-medium text-pink-600 hover:text-pink-700"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t bg-white p-4">
                <div className="flex items-center gap-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-black text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">Items per page</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Page {page}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={!hasPrev}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={!hasNext}
                            onClick={() => setPage((p) => p + 1)}
                            className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawTable;
