import React, { useEffect, useMemo, useState } from "react";
import { fetchData } from "../common/axiosInstance";
import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";

const PageSize = 10; // start page size 

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    // Read initial page,limit
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const limitFromUrl = Number(searchParams.get("limit")) || PageSize;

    const [page, setPage] = useState(pageFromUrl);
    const [limit, setLimit] = useState(limitFromUrl);

    // Keep URL in sync with state
    useEffect(() => {
        const sp = new URLSearchParams(searchParams);
        sp.set("page", String(page));
        sp.set("limit", String(limit));
        setSearchParams(sp, { replace: true });
        // eslint-disable-next-line
    }, [page, limit]);

    // Fetch on page,limit change
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchData(`/projects/all?page=${page}&limit=${limit}`);
                const rows = Array.isArray(data) ? data : data?.projects || [];
                setProjects(rows);
                setTotal(data?.total ?? rows.length);
            } catch (e) {
                console.error("Error fetching projects:", e);
                setProjects([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page, limit]);


    const [startRow, endRow] = useMemo(() => {
        if (!total) return [0, 0];
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, total);
        return [start, end];
    }, [page, limit, total]);

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">All Projects</h1>

            <div className="mb-4 text-sm text-gray-600">
                {loading ? "Loading…" : `Showing ${startRow}–${endRow} of ${total}`}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-700">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-600 text-sm font-medium">
                            <th className="py-3 px-4">Project Id</th>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Currency</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-gray-800">{project.id ?? "N/A"}</td>
                                <td className="py-3 px-4">
                                    <img
                                        src={
                                            project.images?.[0]
                                                ? `${import.meta.env.VITE_API_URL}/${project.images[0]}`
                                                : "https://via.placeholder.com/60"
                                        }
                                        alt={project.name}
                                        className="w-12 h-12 object-cover rounded-md border"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/60";
                                        }}
                                    />
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-900 truncate max-w-xs">
                                    {project.name}
                                </td>
                                <td className="py-3 px-4">
                                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                                        Active <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    </span>
                                </td>
                                {/* Currency */}
                                <td className="py-3 px-4 text-gray-800">
                                    {project.currency ? `${project.currency}` : "N/A"}
                                </td>
                            </tr>
                        ))}

                        {!loading && projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-gray-500">No projects found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* AntD Pagination */}
            <div className="mt-6 flex items-center justify-center">
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={total}
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={["5", "10", "20", "50", "100"]}
                    onChange={(p, ps) => {
                        // If page size changes, reset to first page
                        if (ps !== limit) {
                            setLimit(ps);
                            setPage(1);
                        } else {
                            setPage(p);
                        }
                    }}
                    showTotal={(t, range) => `${range[0]}-${range[1]} of ${t}`}
                />
            </div>
        </div>
    );
};

export default AllProjects;
