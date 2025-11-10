import React from "react";

const DisputeAdminResolutionForm = ({
    isResolved,
    onSubmit,
    status,
    setStatus,
    refundAmount,
    setRefundAmount,
    resolution,
    setResolution,
}) => {
    if (isResolved) {
        return (
            <p className="mt-6 text-xs text-gray-500 italic">
                This dispute is already resolved. Resolution info is shown on
                the left.
            </p>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 mt-10">
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
                            onChange={(e) =>
                                setRefundAmount(e.target.value)
                            }
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
    );
};

export default DisputeAdminResolutionForm;
