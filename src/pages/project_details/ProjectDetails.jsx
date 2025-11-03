// src/features/pages/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchById } from "../../common/axiosInstance";

const MEDIA_BASE = import.meta.env.VITE_API_URL;

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                // /projects/{id}
                const data = await fetchById("/projects", projectId);
                setProject(data);
            } catch (e) {
                console.error("Failed to load project", e);
                setError("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [projectId]);

    const formatDate = (v) =>
        v ? new Date(v).toLocaleString() : "-";

    if (loading) {
        return <div className="p-8">Loading project details…</div>;
    }

    if (error || !project) {
        return (
            <div className="p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 mb-4 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                    ← Back
                </button>
                <div className="text-red-500">{error || "Project not found."}</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-gray-900">
                        {project.name}
                    </h1>
                    <p className="text-sm text-gray-500">Project ID: {project.id}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-black text-sm"
                >
                    ← Back to Projects
                </button>
            </div>

            {/* Top summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="font-semibold mb-3 text-gray-900">Overview</h2>
                    <p className="text-sm text-gray-700 mb-4">
                        {project.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-900">Payment Type:</span>
                        <span className="text-gray-500">{project.payment_option}</span>

                        <span className="text-gray-900">Currency:</span>
                        <span className="text-gray-500">{project.currency}</span>

                        <span className="text-gray-900">Budget Range:</span>
                        <span className="text-gray-500">
                            {project.min_budget} – {project.max_budget} {project.currency}
                        </span>

                        <span className="text-gray-900">Status:</span>
                        <span className="text-gray-500 capitalize">
                            {project.status}
                        </span>

                        <span className="text-gray-900">Posted By (user id):</span>
                        <span className="text-gray-500">{project.posted_by}</span>

                        <span className="text-gray-900">Service Type:</span>
                        <span className="text-gray-500">{project.service_type}</span>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="font-semibold mb-3 text-black">Project Status</h2>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-black">Category ID:</span>
                        <span className="text-black">{project.category_id}</span>

                        <span className="text-black">Subcategory ID:</span>
                        <span className="text-black">{project.subcategory_id}</span>

                        <span className="text-black">Created At:</span>
                        <span className="text-black">
                            {formatDate(project.created_at)}
                        </span>

                        <span className="text-black">Updated At:</span>
                        <span className="text-black">
                            {formatDate(project.updated_at)}
                        </span>

                        <span className="text-black">Location:</span>
                        <span className="text-black">{project.location || "-"}</span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="border border-gray-300 rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-3 text-gray-900">Skills</h2>
                {project.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No skills listed.</p>
                )}
            </div>

            {/* Upgrades */}
            <div className="border border-gray-300 rounded-lg p-4 mb-6">
                <h2 className="font-semibold mb-3 text-gray-900">Upgrades</h2>
                {project.upgrades?.length ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-900 border-b border-gray-300">
                                <th className="py-2 text-black">Name</th>
                                <th className="py-2 text-black">Price ({project.currency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.upgrades.map((u, idx) => (
                                <tr key={idx} className="border-b border-gray-300 last:border-0">
                                    <td className="py-2 text-black">{u.name}</td>
                                    <td className="py-2 text-black">{u.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-gray-500">No upgrades added.</p>
                )}
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Images */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="font-semibold mb-3 text-gray-900">Images</h2>
                    {project.images?.length ? (
                        <div className="flex flex-wrap gap-3">
                            {project.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`${MEDIA_BASE}/${img}`}
                                    alt={`Project image ${idx + 1}`}
                                    className="w-28 h-28 object-cover rounded border border-gray-300"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No images uploaded.</p>
                    )}
                </div>

                {/* Files */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="font-semibold mb-3 text-gray-900">Files</h2>
                    {project.files?.length ? (
                        <ul className="list-disc list-inside text-sm">
                            {project.files.map((file, idx) => (
                                <li key={idx}>
                                    <a
                                        href={`${MEDIA_BASE}/${file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {file.split("/").pop()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No files uploaded.</p>
                    )}
                </div>

                {/* Video */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="font-semibold mb-3 text-gray-900">Video</h2>
                    {project.video?.length ? (
                        <video
                            controls
                            className="w-full rounded border"
                            src={`${MEDIA_BASE}/${project.video[0]}`}
                        />
                    ) : (
                        <p className="text-sm text-gray-500">No video uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
