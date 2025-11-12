// src/pages/verification/VerificationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {label}
        </span>
        <span className="text-sm text-gray-900 break-words">
            {value !== null && value !== undefined && value !== "" ? value : "-"}
        </span>
    </div>
);

const VerificationDetails = () => {
    const { ekycId } = useParams();
    const navigate = useNavigate();

    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchData(`/ekyc/${ekycId}`);
                setVerification(data);
            } catch (err) {
                console.error("Failed to load EKYC details:", err);
                setError("Failed to load verification details.");
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [ekycId]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Verification Details
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            EKYC ID: {ekycId}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ⟵ Back to list
                    </button>
                </div>

                {loading && (
                    <div className="text-sm text-gray-500">Loading…</div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-2">
                        {error}
                    </div>
                )}

                {!loading && !error && verification && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                        {/* Status row */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <DetailItem label="Name" value={verification.name} />
                                <DetailItem label="Email" value={verification.email} />
                                <DetailItem label="User ID" value={verification.user_id} />
                            </div>
                            <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                                    verification.status
                                )}`}
                            >
                                {formatStatus(verification.status)}
                            </span>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label="Phone Number" value={verification.phone_number} />
                            <DetailItem label="NID Number" value={verification.nid_number} />
                            <DetailItem label="Passport Number" value={verification.pp_number} />
                            <DetailItem label="NID Photo" value={verification.nid_photo} />
                            <DetailItem label="Passport Photo" value={verification.pp_photo} />
                            <DetailItem label="Video" value={verification.video} />
                            <DetailItem
                                label="Payment Verified"
                                value={verification.payment_verified ? "Yes" : "No"}
                            />
                            <DetailItem label="Status" value={formatStatus(verification.status)} />
                            <DetailItem label="Created At" value={verification.created_at} />
                            <DetailItem label="Updated At" value={verification.updated_at} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationDetails;
