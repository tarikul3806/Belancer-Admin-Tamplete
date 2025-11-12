import React from "react";
import {
    formatDateParts,
    statusClasses,
    toMoney,
    getAmountPresentation,
} from "../../features/transaction/utils";

const TransactionTable = ({ rows, loading, err, limit }) => {
    return (
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
                    {loading &&
                        Array.from({ length: limit }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-6 py-4">
                                    <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                                    <div className="h-3 w-16 bg-gray-100 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-3 w-28 bg-gray-200 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-3 w-48 bg-gray-200 rounded" />
                                </td>
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
                            <td colSpan={6} className="px-6 py-6 text-sm text-gray-500">
                                No transactions found.
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        !err &&
                        rows.map((tx, idx) => {
                            const { date, time } = formatDateParts(tx.created_at);
                            const statusKey = String(tx.status ?? "").toLowerCase();
                            const statusCls = statusClasses[statusKey] ?? "text-gray-600";
                            const action = String(tx.transaction_type ?? "").replace(
                                /\b\w/g,
                                (s) => s.toUpperCase()
                            );
                            const commission = toMoney(tx.commission ?? 0);

                            return (
                                <tr
                                    key={`${tx.transaction_ref}-${idx}`}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{date}</div>
                                        <div className="text-sm text-gray-500">{time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {action || "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className={`flex items-center gap-2 text-sm ${statusCls}`}
                                        >
                                            <span className="text-xl leading-none">●</span>
                                            <span className="capitalize">
                                                {String(tx.status ?? "—")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {commission}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(() => {
                                            const { text, cls, aria } = getAmountPresentation(
                                                tx.transaction_type,
                                                tx.status,
                                                tx.amount,
                                                tx.currency || "USD"
                                            );
                                            return (
                                                <div
                                                    className={`text-sm font-medium ${cls}`}
                                                    aria-label={aria}
                                                >
                                                    {text}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 font-mono">
                                            {tx.transaction_ref || "—"}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
