import React from "react";

export default function UserTabs({ activeTab, groups, onTabChange }) {
    return (
        <div className="flex items-center gap-8 border-b mb-6">
            <button
                onClick={() => onTabChange("admin")}
                className={`pb-3 px-1 font-medium relative ${activeTab === "admin"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
            >
                Admin ({groups.admins.length})
                {activeTab === "admin" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
            </button>

            <button
                onClick={() => onTabChange("clients")}
                className={`pb-3 px-1 font-medium relative ${activeTab === "clients"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
            >
                Clients ({groups.clients.length})
                {activeTab === "clients" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
            </button>

            <button
                onClick={() => onTabChange("freelancers")}
                className={`pb-3 px-1 font-medium relative ${activeTab === "freelancers"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
            >
                Freelancers ({groups.freelancers.length})
                {activeTab === "freelancers" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
            </button>
        </div>
    );
}
