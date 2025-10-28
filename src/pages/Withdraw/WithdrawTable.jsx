import React from "react";
import { Pagination } from "antd";

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
                            <th className="p-4 text-left font-medium text-gray-600">
                                Wallet Id
                            </th>
                            <th className="p-4 text-left font-medium text-gray-600">
                                Receiver
                            </th>
                            <th className="p-4 text-left font-medium text-gray-600">
                                Amount
                            </th>
                            <th className="p-4 text-left font-medium text-gray-600">
                                Status
                            </th>
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
                                        <td className="p-4 text-gray-700">
                                            {tx.wallet_id ?? "—"}
                                        </td>
                                        <td className="p-4 text-gray-700">{receiverName}</td>
                                        <td className="p-4 text-gray-700">
                                            {fmtAmount(tx.amount, tx.currency)}
                                        </td>
                                        <td className="p-4 text-gray-700 capitalize">
                                            {tx.status}
                                        </td>
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

            {/* ✅ Ant Design Pagination */}
            <div className="flex justify-center border-t bg-white p-4">
                <Pagination
                    current={page}
                    pageSize={itemsPerPage}
                    total={total}
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={["5", "10", "20", "50", "100"]}
                    onChange={(p, ps) => {
                        if (ps !== itemsPerPage) {
                            setItemsPerPage(ps);
                            setPage(1);
                        } else {
                            setPage(p);
                        }
                    }}
                    showTotal={(t, range) => `${range[0]}–${range[1]} of ${t}`}
                />
            </div>
        </div>
    );
};

export default WithdrawTable;
