import React from "react";

const DisputeDetailsModal = ({
    isOpen,
    dispute,
    onClose,
    status,
    setStatus,
    resolution,
    setResolution,
    refundAmount,
    setRefundAmount,
    saving,
    saveError,
    saveSuccess,
    onSubmit,
    getStatusBadgeClasses,
    formatDateTime,
}) => {
    if (!isOpen || !dispute) return null;

    const isResolved = dispute.status === "resolved";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-3xl max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Dispute #{dispute.id}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Order {dispute.order_id || "-"} • Project{" "}
                            {dispute.project_id || "-"} • Gig{" "}
                            {dispute.gig_id || "-"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
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
                                {dispute.raised_by ?? "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Against ID
                            </p>
                            <p className="text-gray-800">
                                {dispute.against_id ?? "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Status
                            </p>
                            <span
                                className={getStatusBadgeClasses(dispute.status)}
                            >
                                {dispute.status || "unknown"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Refund Amount
                            </p>
                            <p className="text-gray-800">
                                {dispute.refund_amount ?? "-"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Created At
                            </p>
                            <p className="text-gray-800">
                                {formatDateTime(dispute.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Updated At
                            </p>
                            <p className="text-gray-800">
                                {formatDateTime(dispute.updated_at)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Resolved By
                            </p>
                            <p className="text-gray-800">
                                {dispute.resolved_by ?? "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase">
                                Resolution
                            </p>
                            <p className="text-gray-800">
                                {dispute.resolution || "-"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                            Reason
                        </p>
                        <p className="text-gray-800">
                            {dispute.reason || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                            Details
                        </p>
                        <p className="text-gray-700 whitespace-pre-line">
                            {dispute.details || "-"}
                        </p>
                    </div>

                    {/* Admin Resolution Form */}
                    {!isResolved && (
                        <div className="pt-4 mt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Admin Resolution
                            </p>
                            <form
                                id="disputeResolveForm"
                                onSubmit={onSubmit}
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
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-xs">
                        {!isResolved && saveError && (
                            <p className="text-red-500">{saveError}</p>
                        )}
                        {!isResolved && !saveError && saveSuccess && (
                            <p className="text-green-600">{saveSuccess}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>

                        {!isResolved && (
                            <button
                                type="submit"
                                form="disputeResolveForm"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeDetailsModal;
