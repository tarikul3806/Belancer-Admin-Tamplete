import React from "react";

const ApplicationDetailsModal = ({
    application,
    open,
    onClose,
    statusDraft,
    onStatusDraftChange,
    statusSaving,
    statusSaveError,
    onStatusSave,
    renderStatusPill,
    formatDateTime,
}) => {
    if (!open || !application) return null;

    const selected = application;
    const currentStatus = (selected.status || "").toLowerCase();
    const showAdminUpdate =
        currentStatus !== "success" && currentStatus !== "cancelled";


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-lg text-black font-semibold">
                            {selected.name || "Application details"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {selected.application_for || "Unknown tier"} • User ID:{" "}
                            {selected.user_id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Close
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 text-sm space-y-4 overflow-y-auto">
                    {/* current status */}
                    <section className="text-gray-600">
                        <h3 className="text-black font-semibold mb-1">Status</h3>
                        {renderStatusPill(selected.status)}
                        <p className="text-xs text-gray-600 mt-2">
                            Applied at {formatDateTime(selected.created_at)}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">Skills</h3>
                        {Array.isArray(selected.skills) && selected.skills.length > 0 ? (
                            <ul className="text-black list-disc list-inside space-y-0.5">
                                {selected.skills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No skills provided.</p>
                        )}
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">Experience</h3>
                        <p className="text-gray-700">
                            Years of experience:{" "}
                            <span className="font-medium">
                                {selected.years_of_experience ?? 0}
                            </span>
                        </p>
                        <p className="text-gray-700">
                            Other marketplace experience:{" "}
                            <span className="font-medium">
                                {selected.other_mktplc_exp ?? 0}
                            </span>
                        </p>
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">Availability</h3>
                        <p className="text-gray-700">
                            {selected.availability || "Not specified"}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">
                            Why do they apply?
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                            {selected.why || "No motivation text provided."}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">External Profiles</h3>
                        {Array.isArray(selected.external_profile_links) &&
                            selected.external_profile_links.length > 0 ? (
                            <ul className="text-black list-disc list-inside space-y-0.5">
                                {selected.external_profile_links.map((link, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#0088FF] hover:underline break-all"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No external links provided.</p>
                        )}
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">
                            Portfolio Samples
                        </h3>
                        {Array.isArray(selected.portfolio_samples) &&
                            selected.portfolio_samples.length > 0 ? (
                            <ul className="text-black list-disc list-inside space-y-0.5">
                                {selected.portfolio_samples.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No portfolio samples provided.</p>
                        )}
                    </section>

                    <section>
                        <h3 className="text-black font-semibold mb-1">Certificates</h3>
                        {Array.isArray(selected.certificates) &&
                            selected.certificates.length > 0 ? (
                            <ul className="text-black list-disc list-inside space-y-0.5">
                                {selected.certificates.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No certificates listed.</p>
                        )}
                    </section>

                    {/* admin status update */}
                    {showAdminUpdate && (
                        <section className="pt-3 border-t border-gray-100">
                            <h3 className="text-black font-semibold mb-2">Admin update</h3>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={statusDraft}
                                        onChange={(e) => onStatusDraftChange(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black bg-white"
                                    >
                                        <option value="pending">pending</option>
                                        <option value="success">success</option>
                                        <option value="cancelled">cancelled</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={onStatusSave}
                                    disabled={statusSaving}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${statusSaving
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#FF006E] hover:bg-[#e00062]"
                                        }`}
                                >
                                    {statusSaving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                            {statusSaveError && (
                                <p className="mt-2 text-xs text-red-500">{statusSaveError}</p>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;
