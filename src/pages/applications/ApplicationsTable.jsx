import React from "react";

const ApplicationsTable = ({
    applications,
    loading,
    error,
    page,
    hasMore,
    onPageChange,
    onSelectApplication,
    renderStatusPill,
}) => {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-10 flex justify-center items-center text-gray-500 text-sm">
                        Loading applications…
                    </div>
                ) : error ? (
                    <div className="py-10 flex justify-center items-center text-red-500 text-sm">
                        {error}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="py-10 flex justify-center items-center text-gray-500 text-sm">
                        No applications found for this filter.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                    Applicant
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                    Applied For
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                    Skills
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                    Availability
                                </th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {applications.map((app) => {
                                const skills = Array.isArray(app.skills) ? app.skills : [];
                                const skillPreview =
                                    skills.length > 0 ? skills.slice(0, 3).join(", ") : "-";

                                return (
                                    <tr key={app.id}>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {app.name || "Unnamed"}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    User ID: {app.user_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700">
                                            {app.application_for || "-"}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700">
                                            <span className="line-clamp-2">{skillPreview}</span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 text-xs">
                                            {app.availability || "-"}
                                        </td>
                                        <td className="px-6 py-3">
                                            {renderStatusPill(app.status)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => onSelectApplication(app)}
                                                className="text-sm font-medium text-[#FF006E] hover:text-pink-700 hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-3 py-1.5 rounded-lg border ${page === 1
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    Previous
                </button>

                <span className="text-gray-500">Page {page}</span>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasMore}
                    className={`px-3 py-1.5 rounded-lg border ${!hasMore
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default ApplicationsTable;
