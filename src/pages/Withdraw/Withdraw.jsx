import React, { useEffect, useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import { fetchData } from "../../common/axiosInstance";
import WithdrawTable from "./WithdrawTable";
import WithdrawDetailsModal from "./WithdrawDetailsModal";

const Withdraw = () => {
    const [activeTab, setActiveTab] = useState("requests");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);

    // fetch withdrawal requests
    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchData("/withdrawal/requests/all", { page, limit: itemsPerPage })
            .then((res) => {
                if (!alive) return;
                setRows(res?.withdrawal_requests ?? []);
                setTotal(res?.total ?? 0);
            })
            .catch((e) => {
                if (!alive) return;
                setError(e?.response?.data?.detail || "Failed to load withdrawals");
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [page, itemsPerPage]);

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
                    className={`relative px-1 pb-3 font-medium transition-colors ${activeTab === "requests"
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Requests (
                    {rows.filter((r) => r.status === "pending").length})
                    {activeTab === "requests" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("completed")}
                    className={`relative px-1 pb-3 font-medium transition-colors ${activeTab === "completed"
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Completed
                    {activeTab === "completed" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
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

            {/* Table */}
            <WithdrawTable
                rows={rows}
                loading={loading}
                error={error}
                activeTab={activeTab}
                page={page}
                setPage={setPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                openDetails={openDetails}
                total={total}
            />

            {/* Modal */}
            <WithdrawDetailsModal
                open={open}
                onClose={() => setOpen(false)}
                selectedTx={selectedTx}
                setRows={setRows}
            />
        </div>
    );
};

export default Withdraw;
