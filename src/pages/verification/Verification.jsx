import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../common/axiosInstance";


const getStatusStyles = (status) => {
    const normalized = (status || "").toLowerCase();

    if (["verified", "approved", "passed"].includes(normalized)) {
        return "bg-green-100 text-green-700";
    }
    if (["rejected", "failed"].includes(normalized)) {
        return "bg-red-100 text-red-700";
    }
    return "bg-orange-100 text-orange-700";
};

const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const Verification = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadVerifications = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchData("/ekyc", {
                    skip: 0,
                    limit: 20,
                });

                const list = Array.isArray(data) ? data : data ? [data] : [];
                setVerifications(list);
            } catch (err) {
                console.error("Failed to load EKYC list:", err);
                setError("Failed to load verifications.");
            } finally {
                setLoading(false);
            }
        };

        loadVerifications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        All Verifications
                    </h1>
                </div>

                {/* Filters (UI only for now; you can wire status_q etc. later) */}
                <div className="flex gap-3 mb-6">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                        All Verifications
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                        All Statuses
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                        By Oldest Date
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-2">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-6 text-sm text-gray-500">Loading…</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User ID
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {verifications.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-4 text-sm text-gray-500 text-center"
                                            >
                                                No verification applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                        verifications.map((verification, index) => (
                                            <tr
                                                key={verification.id ?? index}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {verification.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {verification.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {verification.user_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                                                            verification.status
                                                        )}`}
                                                    >
                                                        {formatStatus(verification.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <button
                                                        onClick={() => navigate(`/admin/verification/${verification.id}`)}
                                                        className="text-sm font-medium text-[#FF006E] hover:text-pink-700 hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;
