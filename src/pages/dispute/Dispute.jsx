import React, { useEffect, useState } from "react";
import api, { fetchData } from "../../common/axiosInstance";

const Dispute = () => {
    const [disputes, setDisputes] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");


    // form state for admin actions
    const [resolution, setResolution] = useState("");
    const [status, setStatus] = useState("resolved");
    const [refundAmount, setRefundAmount] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

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

    // split disputes by status
    const resolvedDisputes = disputes.filter((d) => d.status === "resolved");
    const unresolvedDisputes = disputes.filter((d) => d.status !== "resolved");

    // All = only NOT resolved
    const filteredDisputes =
        statusFilter === "resolved" ? resolvedDisputes : unresolvedDisputes;

    // counts per tab (current page only)
    const allCount = unresolvedDisputes.length;
    const resolvedCount = resolvedDisputes.length;
    const totalForFilter = statusFilter === "resolved" ? resolvedCount : allCount;


    const formatDateTime = (value) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleString();
    };

    const getStatusBadgeClasses = (statusValue) => {
        const base =
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

        switch (statusValue) {
            case "open":
                return `${base} bg-yellow-50 text-yellow-700`;
            case "resolved":
                return `${base} bg-green-50 text-green-700`;
            default:
                return `${base} bg-gray-50 text-gray-500`;
        }
    };


    const handleView = (dispute) => {
        setSelectedDispute(dispute);
        setResolution(dispute.resolution || "");
        setStatus(dispute.status || "open");
        setRefundAmount(
            dispute.refund_amount === null || dispute.refund_amount === undefined
                ? ""
                : dispute.refund_amount
        );
        setSaveError("");
        setSaveSuccess("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDispute(null);
        setResolution("");
        setStatus("resolved");
        setRefundAmount("");
        setSaveError("");
        setSaveSuccess("");
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!selectedDispute) return;

        try {
            setSaving(true);
            setSaveError("");
            setSaveSuccess("");

            const payload = {
                resolution: resolution.trim(),
                status: "resolved",
                refund_amount:
                    refundAmount === "" || refundAmount === null
                        ? 0
                        : Number(refundAmount),
            };
            console.log("Updating dispute with payload:", payload);

            await api.patch(`/disputes/${selectedDispute.id}`, payload);
            await loadDisputes(page);

            setSelectedDispute((prev) =>
                prev ? { ...prev, ...payload } : prev
            );

            setSaveSuccess("Dispute updated successfully.");
        } catch (err) {
            console.error("Failed to update dispute", err);
            if (err.response?.data) {
                console.log("Server validation error:", err.response.data);
            }
            setSaveError("Failed to update dispute. Please try again.");
        } finally {
            setSaving(false);
        }
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
                        <p className="text-xs text-gray-500">
                            {statusFilter === "resolved" ? "Resolved Disputes" : "All Disputes"}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                            {statusFilter === "resolved" ? resolvedCount : allCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Card */}
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
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-full border font-medium ${statusFilter === "all"
                                ? "bg-pink-50 text-pink-600 border-pink-200"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter("resolved")}
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

                            {!loading && !error && filteredDisputes.map((d) => (
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
                    <div className="w-full max-w-3xl max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
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
                        <div className="px-6 py-4 space-y-4 text-sm flex-1 overflow-y-auto">
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
                                    <span
                                        className={getStatusBadgeClasses(selectedDispute.status)}
                                    >
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

                            {/* Admin Resolution Form */}
                            <div className="pt-4 mt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                    Admin Resolution
                                </p>
                                <form
                                    id="disputeResolveForm"
                                    onSubmit={handleResolve}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="text-sm block w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                            >
                                                <option value="open">open</option>
                                                <option value="resolved">resolved</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                                Refund Amount
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="01"
                                                value={refundAmount}
                                                onChange={(e) => setRefundAmount(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                                            Resolution Note
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={resolution}
                                            onChange={(e) => setResolution(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Write how this dispute was resolved..."
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            <div className="text-xs">
                                {saveError && (
                                    <p className="text-red-500">{saveError}</p>
                                )}
                                {!saveError && saveSuccess && (
                                    <p className="text-green-600">{saveSuccess}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    form="disputeResolveForm"
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dispute;
