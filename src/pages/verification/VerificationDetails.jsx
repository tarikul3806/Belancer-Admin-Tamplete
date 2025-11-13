import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData, deleteData, patchData } from "../../common/axiosInstance";

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
    const [savingPayment, setSavingPayment] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);

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

    const handleDelete = async () => {
        if (!window.confirm("Delete this verification application? This cannot be undone.")) return;
        try {
            await deleteData(`/ekyc/${ekycId}`);
            alert("Verification application deleted.");
            navigate("/admin/verification");
        } catch (err) {
            console.error(err);
            setError("Delete failed.");
        }
    };

    const handlePaymentUpdate = async (nextValue) => {
        try {
            setSavingPayment(true);
            const updated = await patchData(`/ekyc/${ekycId}/payment`, {
                id: ekycId,
                payment_verified: nextValue,
            });
            setVerification(updated);
        } catch (err) {
            console.error(err);
            setError("Payment update failed.");
        } finally {
            setSavingPayment(false);
        }
    };

    const allowedStatuses = ["unverified", "verified", "rejected"];
    const [pendingStatus, setPendingStatus] = useState("");

    const handleStatusUpdate = async () => {
        if (!pendingStatus) return;
        try {
            setSavingStatus(true);
            const updated = await patchData(`/ekyc/${ekycId}/status`, { status: pendingStatus });
            setVerification(updated);
            setPendingStatus("");
        } catch (err) {
            console.error(err);
            setError("Status update failed.");
        } finally {
            setSavingStatus(false);
        }
    };


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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ⟵ Back to list
                        </button>

                        {/* Delete */}
                        <button
                            onClick={handleDelete}
                            className="text-sm px-3 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                            title="Delete this application"
                        >
                            Delete
                        </button>
                    </div>
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

                        {/* Action row */}
                        <div className="flex flex-wrap items-center gap-3 justify-end">
                            {/* Payment */}
                            <div className="flex items-center text-black gap-2">
                                <span className="text-sm text-gray-600">Payment:</span>
                                <button
                                    disabled={savingPayment}
                                    onClick={() => handlePaymentUpdate(true)}
                                    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Mark Paid
                                </button>
                                <button
                                    disabled={savingPayment}
                                    onClick={() => handlePaymentUpdate(false)}
                                    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Mark Unpaid
                                </button>
                            </div>

                            {/* Status */}
                            <div className="flex items-center text-black gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                <select
                                    value={pendingStatus}
                                    onChange={(e) => setPendingStatus(e.target.value)}
                                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                                >
                                    <option value="">Select…</option>
                                    {allowedStatuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <button
                                    disabled={!pendingStatus || savingStatus}
                                    onClick={handleStatusUpdate}
                                    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationDetails;
