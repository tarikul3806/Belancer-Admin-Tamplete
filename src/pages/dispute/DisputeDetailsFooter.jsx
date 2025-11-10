import React from "react";

const DisputeDetailsFooter = ({
    isResolved,
    saving,
    saveError,
    saveSuccess,
    onClose,
}) => {
    return (
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
    );
};

export default DisputeDetailsFooter;
