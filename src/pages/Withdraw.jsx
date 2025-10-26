import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, Filter, X } from "lucide-react";
// ⬇️ adjust this path if needed
import { fetchData } from "../common/axiosInstance";

// ---------- Modal (unchanged) ----------
const Modal = ({ open, title, onClose, children }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (open && dialogRef.current) dialogRef.current.focus();
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="modal-title">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div ref={dialogRef} tabIndex={-1} className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-xl focus:outline-none">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="rounded p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

// ---------- Util ----------
const currencySymbol = (c) => {
    const map = { BDT: "৳", USD: "$", EUR: "€", GBP: "£", INR: "₹" };
    return map[c] ?? (c || "");
};
const fmtAmount = (amount, currency) => {
    const n = Number(amount ?? 0);
    return `${currencySymbol(currency)} ${n.toFixed(2)}`;
};

// ---------- Page ----------
const Withdraw = () => {
    const [activeTab, setActiveTab] = useState("requests");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // data
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // modal
    const [open, setOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);

    // fetch data
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError("");

        // backend supports pagination; pass page & limit
        fetchData("/withdrawal/requests/all", { page, limit: itemsPerPage })
            .then((res) => {
                if (!alive) return;
                setRows(res?.withdrawal_requests ?? []);
                setTotal(res?.total ?? 0);
            })
            .catch((e) => {
                if (!alive) return;
                const msg = e?.response?.data?.detail || "Failed to load withdrawals";
                setError(msg);
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [page, itemsPerPage]);

    const hasPrev = page > 1;
    const hasNext = page * itemsPerPage < total;

    const openDetails = (tx) => {
        setSelectedTx(tx);
        setOpen(true);
    };

    return (
        <div className="mx-auto bg-white p-6">
            <h1 className="mb-6 text-2xl font-semibold text-black">Withdraw</h1>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-8">
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`relative px-1 pb-3 font-medium transition-colors ${activeTab === "requests" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    {/* ✅ dynamic total count */}
                    Requests ({total})
                    {activeTab === "requests" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>

                {/* We’ll wire these two once you have status endpoints or a summary */}
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`relative px-1 pb-3 font-medium transition-colors ${activeTab === "pending" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Pending
                    {activeTab === "pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`relative px-1 pb-3 font-medium transition-colors ${activeTab === "completed" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Completed
                    {activeTab === "completed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>

                <div className="ml-auto flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                        <ArrowUpDown size={16} />
                        Sort
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
            )}

            {/* Table */}
            <div className="rounded-lg bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="whitespace-nowrap p-4 text-left font-medium text-gray-600">Wallet Id</th>
                                <th className="whitespace-nowrap p-4 text-left font-medium text-gray-600">Receiver</th>
                                <th className="whitespace-nowrap p-4 text-left font-medium text-gray-600">Transaction Amount</th>
                                <th className="p-4" />
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td className="p-4 text-gray-500" colSpan={4}>Loading…</td>
                                </tr>
                            )}

                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td className="p-4 text-gray-500" colSpan={4}>No withdrawal requests found.</td>
                                </tr>
                            )}

                            {!loading &&
                                rows.map((tx) => {
                                    const receiverName =
                                        tx.receiver_account_holder_name ||
                                        tx.receiver_name ||
                                        (tx.wallet_holder ? `User #${tx.wallet_holder}` : "—");
                                    return (
                                        <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="whitespace-nowrap p-4 text-gray-700">{tx.wallet_id ?? "—"}</td>
                                            <td className="whitespace-nowrap p-4 text-gray-700">{receiverName}</td>
                                            <td className="whitespace-nowrap p-4 text-gray-700">
                                                {fmtAmount(tx.amount, tx.currency)}
                                            </td>
                                            <td className="whitespace-nowrap p-4">
                                                <button
                                                    onClick={() => openDetails(tx)}
                                                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600">Items per page</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Page {page}</span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={!hasPrev}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="text-sm text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                disabled={!hasNext}
                                onClick={() => setPage((p) => p + 1)}
                                className="text-sm text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <Modal open={open} title="Transaction Details" onClose={() => setOpen(false)}>
                {selectedTx && (
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6">
                        {/* wallet_id */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Wallet Id</div>
                            <div className="text-gray-900">{selectedTx.wallet_id ?? "—"}</div>
                        </div>

                        {/* receiver_account_holder_name */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Receiver Account Holder</div>
                            <div className="text-gray-900">
                                {selectedTx.receiver_account_holder_name ?? "—"}
                            </div>
                        </div>

                        {/* wallet_holder */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Wallet Holder (User Id)</div>
                            <div className="text-gray-900">{selectedTx.wallet_holder ?? "—"}</div>
                        </div>

                        {/* amount */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Amount</div>
                            <div className="text-gray-900">
                                {typeof selectedTx.amount === "number"
                                    ? selectedTx.amount.toFixed(2)
                                    : selectedTx.amount ?? "—"}
                            </div>
                        </div>

                        {/* currency */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Currency</div>
                            <div className="text-gray-900">{selectedTx.currency ?? "—"}</div>
                        </div>

                        {/* transaction_ref */}
                        <div className="sm:col-span-2">
                            <div className="text-xs uppercase text-gray-500">Transaction Ref</div>
                            <div className="break-all text-gray-900">{selectedTx.transaction_ref ?? "—"}</div>
                        </div>

                        {/* gateway_type */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Gateway</div>
                            <div className="text-gray-900">{selectedTx.gateway_type ?? "—"}</div>
                        </div>

                        {/* receiver_bank_name */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Receiver Bank</div>
                            <div className="text-gray-900">{selectedTx.receiver_bank_name ?? "—"}</div>
                        </div>

                        {/* receiver_bank_branch_name */}
                        <div>
                            <div className="text-xs uppercase text-gray-500">Receiver Branch</div>
                            <div className="text-gray-900">{selectedTx.receiver_bank_branch_name ?? "—"}</div>
                        </div>

                        {/* receiver_account_number */}
                        <div className="sm:col-span-2">
                            <div className="text-xs uppercase text-gray-500">Receiver Account Number</div>
                            <div className="break-all text-gray-900">{selectedTx.receiver_account_number ?? "—"}</div>
                        </div>

                        {/* created_at */}
                        <div className="sm:col-span-2">
                            <div className="text-xs uppercase text-gray-500">Created At</div>
                            <div className="text-gray-900">
                                {selectedTx.created_at
                                    ? new Date(selectedTx.created_at).toLocaleString()
                                    : "—"}
                            </div>
                        </div>

                        {/* footer */}
                        <div className="col-span-full mt-2 flex justify-end gap-2 pt-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default Withdraw;
