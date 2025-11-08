import React, { useEffect, useState } from "react";
import api, { fetchData } from "../../common/axiosInstance";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

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

    // keep modal dropdown in a valid state
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
                        . Applicants are interviewed manually by the Belancer team; only
                        the status is exposed on the main site.
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

            {/* Table */}
            <ApplicationsTable
                applications={processedApplications}
                loading={loading}
                error={error}
                page={page}
                hasMore={hasMore}
                onPageChange={setPage}
                onSelectApplication={setSelected}
                renderStatusPill={renderStatusPill}
            />

            {/* Details modal */}
            <ApplicationDetailsModal
                application={selected}
                open={!!selected}
                onClose={() => setSelected(null)}
                statusDraft={statusDraft}
                onStatusDraftChange={setStatusDraft}
                statusSaving={statusSaving}
                statusSaveError={statusSaveError}
                onStatusSave={handleStatusSave}
                renderStatusPill={renderStatusPill}
                formatDateTime={formatDateTime}
            />
        </div>
    );
};

export default Applications;
