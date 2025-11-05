/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { fetchData } from "../../common/axiosInstance";
import UserTabs from "./UserTabs";
import UserSearchInput from "./UserSearchInput";
import UsersTable from "./UsersTable";

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
                const raw = Array.isArray(data?.detail)
                    ? data.detail
                    : Array.isArray(data)
                        ? data
                        : [];
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
                        isAdmin:
                            roleParts.includes("admin") ||
                            roleParts.includes("masteradmin") ||
                            roleParts.includes("superadmin"),
                        isClient: roleParts.includes("client") || roleParts.includes("buyer"),
                        isFreelancer:
                            roleParts.includes("seller") || roleParts.includes("freelancer"),
                    };

                    const initials =
                        (first?.[0] ?? "").toUpperCase() +
                        (last?.[0] ??
                            (first ? "" : (u.email?.[0] ?? "U").toUpperCase()));

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
            activeTab === "admin"
                ? groups.admins
                : activeTab === "clients"
                    ? groups.clients
                    : groups.freelancers;
        if (!searchTerm) return base;
        const q = searchTerm.toLowerCase();
        return base.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        );
    }, [activeTab, groups, searchTerm]);

    const handleMenuClick = (user) => ({ key }) => {
        if (key === "assign") {
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

            <UserTabs
                activeTab={activeTab}
                groups={groups}
                onTabChange={setActiveTab}
            />

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <UserSearchInput
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                </div>

                <UsersTable
                    loading={loading}
                    err={err}
                    visible={visible}
                    menuItems={menuItems}
                    handleMenuClick={handleMenuClick}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
}
