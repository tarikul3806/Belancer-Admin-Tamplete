import React from "react";

const DisputeDetailsHeader = ({
    dispute,
    showMessages,
    onToggleMessages,
    onClose,
}) => {
    return (
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
            <div className="flex gap-5 items-center">
                <button
                    type="button"
                    onClick={onToggleMessages}
                    className="text-gray-600 hover:underline text-sm"
                >
                    {showMessages ? "Hide Messages" : "View Messages"}
                </button>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default DisputeDetailsHeader;
