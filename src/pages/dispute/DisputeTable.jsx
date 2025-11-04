import React from "react";

const DisputeTable = ({
    statusFilter,
    onStatusFilterChange,
    filteredDisputes,
    loading,
    error,
    page,
    totalPages,
    limit,
    totalForFilter,
    onPageChange,
    onView,
}) => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
            {/* Top toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                        {statusFilter === "resolved" ? "Resolved Disputes" : "All Disputes"}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    {statusFilter === "resolved" && (
                        <span className="ml-2 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            Filter: Resolved
                        </span>
                    )}
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 text-xs">
                    <button
                        onClick={() => onStatusFilterChange("all")}
                        className={`px-3 py-1.5 rounded-full border font-medium ${statusFilter === "all"
                            ? "bg-pink-50 text-pink-600 border-pink-200"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => onStatusFilterChange("resolved")}
                        className={`px-3 py-1.5 rounded-full border font-medium ${statusFilter === "resolved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order / Project / Gig
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Against ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reason
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    Loading disputes...
                                </td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-sm text-red-500"
                                >
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && filteredDisputes.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No disputes found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !error &&
                            filteredDisputes.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50/70">
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                        {d.id}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-xs">
                                        <div className="flex flex-col gap-0.5">
                                            <span>Order: {d.order_id ?? "-"}</span>
                                            <span>Project: {d.project_id ?? "-"}</span>
                                            <span>Gig: {d.gig_id ?? "-"}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                        {d.against_id}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                        {d.reason || "-"}
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() => onView(d)}
                                            className="text-sm font-medium text-pink-600 hover:text-pink-700"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
                <div className="text-gray-500">
                    Showing{" "}
                    <span className="font-medium">
                        {filteredDisputes.length === 0
                            ? 0
                            : (page - 1) * limit + 1}
                        -
                        {(page - 1) * limit + filteredDisputes.length}
                    </span>{" "}
                    of <span className="font-medium">{totalForFilter}</span> disputes
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1 || loading}
                        onClick={() => onPageChange(page - 1)}
                        className={`px-3 py-1.5 rounded border text-sm ${page <= 1 || loading
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-500">
                        Page {page} / {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages || loading}
                        onClick={() => onPageChange(page + 1)}
                        className={`px-3 py-1.5 rounded border text-sm ${page >= totalPages || loading
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisputeTable;
