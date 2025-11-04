import React, { useEffect, useState } from "react";
import api, { fetchData } from "../../common/axiosInstance";
import DisputeTable from "./DisputeTable";
import DisputeDetailsModal from "./DisputeDetailsModal";

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
    const totalForFilter =
        statusFilter === "resolved" ? resolvedCount : allCount;

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

            setSelectedDispute((prev) => (prev ? { ...prev, ...payload } : prev));
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

    const handlePageChange = (newPage) => {
        loadDisputes(newPage);
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

            {/* Table / card */}
            <DisputeTable
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                filteredDisputes={filteredDisputes}
                loading={loading}
                error={error}
                page={page}
                totalPages={totalPages}
                limit={limit}
                totalForFilter={totalForFilter}
                onPageChange={handlePageChange}
                onView={handleView}
            />

            {/* Modal */}
            <DisputeDetailsModal
                isOpen={isModalOpen}
                dispute={selectedDispute}
                onClose={closeModal}
                status={status}
                setStatus={setStatus}
                resolution={resolution}
                setResolution={setResolution}
                refundAmount={refundAmount}
                setRefundAmount={setRefundAmount}
                saving={saving}
                saveError={saveError}
                saveSuccess={saveSuccess}
                onSubmit={handleResolve}
                getStatusBadgeClasses={getStatusBadgeClasses}
                formatDateTime={formatDateTime}
            />
        </div>
    );
};

export default Dispute;
