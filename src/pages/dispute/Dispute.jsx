import React, { useEffect, useState } from "react";
import { fetchData } from "../../common/axiosInstance";

const Dispute = () => {
    const [disputes, setDisputes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadDisputes = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError("");
            const data = await fetchData("/disputes/all", {
                page: pageNumber,
                limit,
            });

            setDisputes(data?.disputes || []);
            setTotal(data?.total || 0);
            setPage(data?.page || pageNumber);
        } catch (err) {
            console.error("Failed to load disputes", err);
            setError("Failed to load disputes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDisputes(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const formatDateTime = (value) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleString();
    };

    const getStatusBadgeClasses = (status) => {
        const base =
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case "open":
                return `${base} bg-blue-50 text-blue-600`;
            case "resolved":
                return `${base} bg-green-50 text-green-600`;
            case "closed":
                return `${base} bg-gray-100 text-gray-600`;
            default:
                return `${base} bg-gray-50 text-gray-500`;
        }
    };

    const handleView = (dispute) => {
        setSelectedDispute(dispute);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDispute(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Dispute Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage disputes raised between buyers and sellers.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Total Disputes</p>
                        <p className="text-lg font-semibold text-gray-900">{total}</p>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
                {/* Top toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">All Disputes</span>
                        <span className="text-gray-300">•</span>
                        <span>
                            Page {page} of {totalPages}
                        </span>
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

                            {!loading && !error && disputes.length === 0 && (
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
                                disputes.map((d) => (
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
                                                onClick={() => handleView(d)}
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
                            {disputes.length === 0
                                ? 0
                                : (page - 1) * limit + 1}
                            -
                            {(page - 1) * limit + disputes.length}
                        </span>{" "}
                        of <span className="font-medium">{total}</span> disputes
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => loadDisputes(page - 1)}
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
                            onClick={() => loadDisputes(page + 1)}
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

            {/* Detail Modal */}
            {isModalOpen && selectedDispute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Dispute #{selectedDispute.id}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Order {selectedDispute.order_id || "-"} • Project{" "}
                                    {selectedDispute.project_id || "-"} • Gig{" "}
                                    {selectedDispute.gig_id || "-"}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Raised By
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedDispute.raised_by ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Against ID
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedDispute.against_id ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Status
                                    </p>
                                    <span className={getStatusBadgeClasses(selectedDispute.status)}>
                                        {selectedDispute.status || "unknown"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Refund Amount
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedDispute.refund_amount ?? "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Created At
                                    </p>
                                    <p className="text-gray-800">
                                        {formatDateTime(selectedDispute.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Updated At
                                    </p>
                                    <p className="text-gray-800">
                                        {formatDateTime(selectedDispute.updated_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Resolved By
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedDispute.resolved_by ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Resolution
                                    </p>
                                    <p className="text-gray-800">
                                        {selectedDispute.resolution || "-"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                    Reason
                                </p>
                                <p className="text-gray-800">
                                    {selectedDispute.reason || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                    Details
                                </p>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {selectedDispute.details || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end px-6 py-4 border-t">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dispute;
