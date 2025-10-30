/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { fetchData } from "../../common/axiosInstance";

const USERS_ENDPOINT = "/auth/admin/users";

export default function AllUsers() {
    const [activeTab, setActiveTab] = useState("admin");
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchData(USERS_ENDPOINT);
                const raw = Array.isArray(data?.detail) ? data.detail : Array.isArray(data) ? data : [];
                if (!mounted) return;

                const normalized = raw.map((u) => {
                    const first = (u.first_name ?? "").trim();
                    const last = (u.last_name ?? "").trim();
                    const name =
                        [first, last].filter(Boolean).join(" ") ||
                        (u.email ? u.email.split("@")[0] : "Unknown");

                    const roleParts = String(u.role ?? "")
                        .toLowerCase()
                        .split(/[,\s]+/)
                        .filter(Boolean);

                    const roleFlags = {
                        isAdmin: roleParts.includes("admin") || roleParts.includes("masteradmin") || roleParts.includes("superadmin"),
                        isClient: roleParts.includes("client") || roleParts.includes("buyer"),
                        isFreelancer: roleParts.includes("seller") || roleParts.includes("freelancer"),
                    };

                    const initials =
                        (first?.[0] ?? "").toUpperCase() +
                        (last?.[0] ?? (first ? "" : (u.email?.[0] ?? "U").toUpperCase()));

                    return {
                        id: u.id,
                        name,
                        email: u.email ?? "",
                        phone: u.phone_number ?? "—",
                        role: u.role ?? "",
                        initials: initials || "U",
                        ...roleFlags,
                    };
                });

                setUsers(normalized);
            } catch (e) {
                setErr(e);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const groups = useMemo(() => {
        const admins = users.filter((u) => u.isAdmin);
        const clients = users.filter((u) => u.isClient);
        const freelancers = users.filter((u) => u.isFreelancer);
        return { admins, clients, freelancers };
    }, [users]);

    const visible = useMemo(() => {
        const base =
            activeTab === "admin" ? groups.admins :
                activeTab === "clients" ? groups.clients :
                    groups.freelancers;
        if (!searchTerm) return base;
        const q = searchTerm.toLowerCase();
        return base.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [activeTab, groups, searchTerm]);

    const handleMenuClick = (user) => ({ key }) => {
        if (key === "assign") {
            // TODO
            console.log("Assign permissions:", user.id);
        } else if (key === "edit") {
            console.log("Edit user:", user.id);
        } else if (key === "delete") {
            console.log("Delete user:", user.id);
        }
    };

    const menuItems = (user) => [
        { key: "assign", label: "Assign Permissions" },
        { key: "edit", label: "Edit" },
        { key: "delete", label: "Delete" },
    ];

    return (
        <div className="mx-auto rounded-lg bg-white p-6">
            <h1 className="mb-6 text-2xl font-semibold text-black">All Users</h1>

            <div className="flex items-center gap-8 border-b mb-6">
                <button
                    onClick={() => setActiveTab("admin")}
                    className={`pb-3 px-1 font-medium relative ${activeTab === "admin" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Admin ({groups.admins.length})
                    {activeTab === "admin" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
                <button
                    onClick={() => setActiveTab("clients")}
                    className={`pb-3 px-1 font-medium relative ${activeTab === "clients" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Clients ({groups.clients.length})
                    {activeTab === "clients" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
                <button
                    onClick={() => setActiveTab("freelancers")}
                    className={`pb-3 px-1 font-medium relative ${activeTab === "freelancers" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Freelancers ({groups.freelancers.length})
                    {activeTab === "freelancers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-12 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                        />
                    </div>
                </div>


                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4 text-sm text-gray-300">—</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                            <div>
                                                <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
                                                <div className="h-3 w-52 bg-gray-100 rounded" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">—</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">—</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">—</td>
                                </tr>
                            ))}

                            {!loading && err && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-sm text-red-600">
                                        Failed to load users. Please check your token / API URL and try again.
                                    </td>
                                </tr>
                            )}

                            {!loading && !err && visible.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-sm text-gray-500">No users found.</td>
                                </tr>
                            )}

                            {!loading && !err && visible.map((u, index) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {u.initials}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Dropdown
                                            menu={{ items: menuItems(u), onClick: handleMenuClick(u) }}
                                            trigger={["click"]}
                                            placement="bottomRight"
                                            getPopupContainer={() => document.body} // avoids clipping
                                        >
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <EllipsisOutlined className="text-gray-400" />
                                            </button>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
