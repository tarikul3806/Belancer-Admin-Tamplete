import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { putData } from "../../common/axiosInstance";

const Modal = ({ open, title, onClose, children }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

const WithdrawDetailsModal = ({ open, onClose, selectedTx, setRows }) => {
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [approveForm, setApproveForm] = useState({
        status: "success",
        remarks: "",
        gateway_transaction_id: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formErr, setFormErr] = useState("");

    if (!selectedTx) return null;

    const onApproveClick = () => {
        setShowApproveForm(true);
    };

    const onDenyClick = async () => {
        if (!selectedTx) return;
        if (!window.confirm("Deny this withdrawal request?")) return;
        try {
            await putData(
                `/admin/transactions/${encodeURIComponent(selectedTx.transaction_ref)}/status`,
                {
                    status: "cancelled",
                    remarks: "Denied by admin",
                    processed_by: 0,
                    gateway_transaction_id: "",
                }
            );
            setRows((prev) =>
                prev.map((r) =>
                    r.id === selectedTx.id ? { ...r, status: "cancelled" } : r
                )
            );
            onClose();
        } catch {
            alert("Failed to deny request");
        }
    };

    const submitApprove = async () => {
        if (!selectedTx) return;
        if (!approveForm.remarks.trim() || !approveForm.gateway_transaction_id.trim())
            return setFormErr("Please fill all fields.");

        setSubmitting(true);
        try {
            await putData(
                `/admin/transactions/${encodeURIComponent(selectedTx.transaction_ref)}/status`,
                {
                    ...approveForm,
                    processed_by: 0,
                }
            );
            setRows((prev) =>
                prev.map((r) =>
                    r.id === selectedTx.id ? { ...r, status: approveForm.status } : r
                )
            );
            setShowApproveForm(false);
            onClose();
        } catch {
            setFormErr("Failed to approve request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Request Details">
            <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6">
                <div>
                    <div className="text-xs uppercase text-gray-500">Wallet ID</div>
                    <div className="text-gray-900">{selectedTx.wallet_id ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Receiver Account Holder</div>
                    <div className="text-gray-900">{selectedTx.receiver_account_holder_name ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Wallet Holder (User ID)</div>
                    <div className="text-gray-900">{selectedTx.wallet_holder ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Amount</div>
                    <div className="text-gray-900">
                        {selectedTx.amount ?? "—"} {selectedTx.currency ?? ""}
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Currency</div>
                    <div className="text-gray-900">{selectedTx.currency ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Transaction Ref</div>
                    <div className="text-gray-900 break-all">{selectedTx.transaction_ref ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Gateway</div>
                    <div className="text-gray-900 capitalize">{selectedTx.gateway_type ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Receiver Bank</div>
                    <div className="text-gray-900">{selectedTx.receiver_bank_name ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Receiver Branch</div>
                    <div className="text-gray-900">{selectedTx.receiver_bank_branch_name ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Receiver Account Number</div>
                    <div className="text-gray-900">{selectedTx.receiver_account_number ?? "—"}</div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Created At</div>
                    <div className="text-gray-900">
                        {selectedTx.created_at
                            ? new Date(selectedTx.created_at).toLocaleString()
                            : "—"}
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase text-gray-500">Status</div>
                    <div className="capitalize text-gray-900">{selectedTx.status ?? "—"}</div>
                </div>
            </div>

            {/* Approve Form */}
            {showApproveForm && !["success", "cancelled"].includes(selectedTx.status) && (
                <div className="mt-5 border border-gray-200 p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            readOnly
                            value={approveForm.status.toUpperCase()}
                            className="border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <input
                            placeholder="Remarks (e.g., bKash)"
                            value={approveForm.remarks}
                            onChange={(e) =>
                                setApproveForm((s) => ({ ...s, remarks: e.target.value }))
                            }
                            className="text-black border p-2 rounded"
                        />
                        <input
                            placeholder="Gateway Transaction ID"
                            value={approveForm.gateway_transaction_id}
                            onChange={(e) =>
                                setApproveForm((s) => ({
                                    ...s,
                                    gateway_transaction_id: e.target.value,
                                }))
                            }
                            className="text-black border p-2 rounded"
                        />
                    </div>
                    {formErr && <p className="mt-2 text-sm text-rose-600">{formErr}</p>}
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setShowApproveForm(false)}
                            className="border px-4 py-2 rounded text-sm text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitApprove}
                            disabled={submitting}
                            className="border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 rounded"
                        >
                            {submitting ? "Submitting..." : "Submit Approval"}
                        </button>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="mt-3 flex justify-end gap-2">
                {!["success", "cancelled"].includes(selectedTx.status) && (
                    <>
                        <button
                            onClick={onDenyClick}
                            className="border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 rounded"
                        >
                            Deny
                        </button>
                        <button
                            onClick={onApproveClick}
                            className="border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 rounded"
                        >
                            Approve
                        </button>
                    </>
                )}
                <button
                    onClick={onClose}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-700 rounded"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default WithdrawDetailsModal;
