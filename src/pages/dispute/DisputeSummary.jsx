import React from "react";

const DisputeSummary = ({
    dispute,
    raisedByUser,
    againstUser,
    getDisplayName,
    getStatusBadgeClasses,
    formatDateTime,
}) => {
    return (
        <div className="space-y-4">
            {/* Raised / Against / Status / Refund */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Raised By
                    </p>
                    <p className="text-gray-800">
                        {/* {dispute.raised_by ?? "-"} */}
                        {raisedByUser && (
                            <span className="text-gray-700">
                                {getDisplayName(raisedByUser)}
                            </span>
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Against ID
                    </p>
                    <p className="text-gray-800">
                        {/* {dispute.against_id ?? "-"} */}
                        {againstUser && (
                            <span className="text-gray-700">
                                {getDisplayName(againstUser)}
                            </span>
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Status
                    </p>
                    <span
                        className={getStatusBadgeClasses(dispute.status)}
                    >
                        {dispute.status || "unknown"}
                    </span>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Refund Amount
                    </p>
                    <p className="text-gray-800">
                        {dispute.refund_amount ?? "-"}
                    </p>
                </div>
            </div>

            {/* Created / Updated / Resolved / Resolution */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Created At
                    </p>
                    <p className="text-gray-800">
                        {formatDateTime(dispute.created_at)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Updated At
                    </p>
                    <p className="text-gray-800">
                        {formatDateTime(dispute.updated_at)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Resolved By
                    </p>
                    <p className="text-gray-800">
                        {dispute.resolved_by ?? "-"}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-700 uppercase">
                        Resolution
                    </p>
                    <p className="text-gray-800">
                        {dispute.resolution || "-"}
                    </p>
                </div>
            </div>

            {/* Reason */}
            <div>
                <p className="text-xs font-medium text-gray-700 uppercase mb-1">
                    Reason
                </p>
                <p className="text-gray-800">
                    {dispute.reason || "-"}
                </p>
            </div>

            {/* Details */}
            <div>
                <p className="text-xs font-medium text-gray-700 uppercase mb-1">
                    Details
                </p>
                <p className="text-gray-700 whitespace-pre-line">
                    {dispute.details || "-"}
                </p>
            </div>
        </div>
    );
};

export default DisputeSummary;
