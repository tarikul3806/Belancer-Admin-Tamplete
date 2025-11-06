import React, { useEffect, useState } from "react";
import api, { fetchData } from "../../common/axiosInstance";

const STATUS_TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "success", label: "Success" },
    { key: "cancelled", label: "Cancelled" },
];

const PAGE_SIZE = 20;

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [activeStatus, setActiveStatus] = useState("all");
    const [tierFilter, setTierFilter] = useState("all");
    const [sortMode, setSortMode] = useState("newest");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selected, setSelected] = useState(null);

    // modal status editing
    const [statusDraft, setStatusDraft] = useState("pending");
    const [statusSaving, setStatusSaving] = useState(false);
    const [statusSaveError, setStatusSaveError] = useState("");

    const loadApplications = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                skip: (page - 1) * PAGE_SIZE,
                limit: PAGE_SIZE,
            };

            if (activeStatus !== "all") {
                params.status_filter = activeStatus;
            }

            const data = await fetchData(
                "/recommendations/admin/applications",
                params
            );

            const list = Array.isArray(data) ? data : [];
            setApplications(list);
            setHasMore(list.length === PAGE_SIZE);
        } catch (err) {
            console.error(err);
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStatus, page]);

    useEffect(() => {
        if (selected) {
            const raw = selected.status || "pending";
            const s = raw.toLowerCase();
            const allowed = ["pending", "success", "cancelled"];
            setStatusDraft(allowed.includes(s) ? s : "pending");
            setStatusSaveError("");
        }
    }, [selected]);


    const handleStatusSave = async () => {
        if (!selected?.id) return;

        const status = (statusDraft || "pending").toLowerCase().trim();

        try {
            setStatusSaving(true);
            setStatusSaveError("");

            await api.patch(
                `/recommendations/admin/applications/${selected.id}/status`,
                { status }
            );

            await loadApplications();
            setSelected(null);
        } catch (err) {
            console.error(err);
            setStatusSaveError("Failed to update status. Please try again.");
        } finally {
            setStatusSaving(false);
        }
    };


    // client-side tier filter + sort
    const processedApplications = applications
        .filter((app) =>
            tierFilter === "all" ? true : app.application_for === tierFilter
        )
        .sort((a, b) => {
            if (sortMode === "oldest") {
                return new Date(a.created_at) - new Date(b.created_at);
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });

    const formatDateTime = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleString();
    };

    const renderStatusPill = (status) => {
        const s = (status || "").toLowerCase();

        let classes =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        if (s === "pending") {
            classes += " bg-yellow-100 text-yellow-800";
        } else if (s === "success" || s === "approved") {
            classes += " bg-green-100 text-green-800";
        } else if (s === "cancelled" || s === "rejected") {
            classes += " bg-red-100 text-red-800";
        } else {
            classes += " bg-gray-100 text-gray-700";
        }

        return <span className={classes}>{status || "Unknown"}</span>;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-3xl text-gray-900 font-semibold mb-1">
                        Applications
                    </h1>
                    <p className="text-sm text-gray-500 max-w-xl">
                        Manage applications for{" "}
                        <span className="font-medium">
                            Recommended, Belancer Pro, Vetted Expert
                        </span>
                        . Applicants are interviewed manually by the Belancer
                        team; only the status is exposed on the main site.
                    </p>
                </div>
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
                {STATUS_TABS.map((tab) => {
                    const active = activeStatus === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveStatus(tab.key);
                                setPage(1);
                            }}
                            className={`pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${active
                                ? "border-[#0088FF] text-[#0088FF]"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                    Showing {processedApplications.length}{" "}
                    {activeStatus === "all"
                        ? "applications"
                        : `${activeStatus} applications`}
                </span>

                <div className="flex items-center gap-3">
                    {/* Tier filter */}
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="text-sm text-black border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                    >
                        <option value="all">All tiers</option>
                        <option value="Recommended">Recommended</option>
                        <option value="Belancer Pro">Belancer Pro</option>
                        <option value="Vetted Expert">Vetted Expert</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value)}
                        className="text-sm text-black border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
            </div>

            {/* Table / content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="py-10 flex justify-center items-center text-gray-500 text-sm">
                        Loading applications…
                    </div>
                ) : error ? (
                    <div className="py-10 flex justify-center items-center text-red-500 text-sm">
                        {error}
                    </div>
                ) : processedApplications.length === 0 ? (
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
                            {processedApplications.map((app) => {
                                const skills = Array.isArray(app.skills)
                                    ? app.skills
                                    : [];
                                const skillPreview =
                                    skills.length > 0
                                        ? skills.slice(0, 3).join(", ")
                                        : "-";

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
                                            <span className="line-clamp-2">
                                                {skillPreview}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 text-xs">
                                            {app.availability || "-"}
                                        </td>
                                        <td className="px-6 py-3">
                                            {renderStatusPill(app.status)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => setSelected(app)}
                                                className="text-sm font-medium text-[#FF006E] hover:underline"
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className={`px-3 py-1.5 rounded-lg border ${!hasMore
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    Next
                </button>
            </div>

            {/* Details modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSelected(null)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-lg text-black font-semibold">
                                    {selected.name || "Application details"}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {selected.application_for ||
                                        "Unknown tier"}{" "}
                                    • User ID: {selected.user_id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                Close
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4 text-sm space-y-4 overflow-y-auto">
                            {/* current status */}
                            <section className="text-gray-600">
                                <h3 className="text-black font-semibold mb-1">
                                    Status
                                </h3>
                                {renderStatusPill(selected.status)}
                                <p className="text-xs text-gray-600 mt-2">
                                    Applied at{" "}
                                    {formatDateTime(selected.created_at)}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    Skills
                                </h3>
                                {Array.isArray(selected.skills) &&
                                    selected.skills.length > 0 ? (
                                    <ul className="text-black list-disc list-inside space-y-0.5">
                                        {selected.skills.map((skill, idx) => (
                                            <li key={idx}>{skill}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No skills provided.
                                    </p>
                                )}
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    Experience
                                </h3>
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
                                <h3 className="text-black font-semibold mb-1">
                                    Availability
                                </h3>
                                <p className="text-gray-700">
                                    {selected.availability || "Not specified"}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    Why do they apply?
                                </h3>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {selected.why ||
                                        "No motivation text provided."}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    External Profiles
                                </h3>
                                {Array.isArray(
                                    selected.external_profile_links
                                ) &&
                                    selected.external_profile_links.length > 0 ? (
                                    <ul className="text-black list-disc list-inside space-y-0.5">
                                        {selected.external_profile_links.map(
                                            (link, idx) => (
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
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No external links provided.
                                    </p>
                                )}
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    Portfolio Samples
                                </h3>
                                {Array.isArray(selected.portfolio_samples) &&
                                    selected.portfolio_samples.length > 0 ? (
                                    <ul className="text-black list-disc list-inside space-y-0.5">
                                        {selected.portfolio_samples.map(
                                            (item, idx) => (
                                                <li key={idx}>{item}</li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No portfolio samples provided.
                                    </p>
                                )}
                            </section>

                            <section>
                                <h3 className="text-black font-semibold mb-1">
                                    Certificates
                                </h3>
                                {Array.isArray(selected.certificates) &&
                                    selected.certificates.length > 0 ? (
                                    <ul className="text-black list-disc list-inside space-y-0.5">
                                        {selected.certificates.map(
                                            (item, idx) => (
                                                <li key={idx}>{item}</li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No certificates listed.
                                    </p>
                                )}
                            </section>

                            {/* admin status update */}
                            <section className="pt-3 border-t border-gray-100">
                                <h3 className="text-black font-semibold mb-2">
                                    Admin update
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={statusDraft}
                                            onChange={(e) =>
                                                setStatusDraft(e.target.value)
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black bg-white"
                                        >
                                            <option value="pending">
                                                pending
                                            </option>
                                            <option value="success">
                                                success
                                            </option>
                                            <option value="cancelled">
                                                cancelled
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleStatusSave}
                                        disabled={statusSaving}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${statusSaving
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#FF006E] hover:bg-[#e00062]"
                                            }`}
                                    >
                                        {statusSaving
                                            ? "Saving..."
                                            : "Save changes"}
                                    </button>
                                </div>
                                {statusSaveError && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {statusSaveError}
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;
