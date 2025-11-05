import React from "react";
import { Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function UsersTable({
    loading,
    err,
    visible,
    menuItems,
    handleMenuClick,
    activeTab,
}) {
    const navigate = useNavigate();
    const isFreelancerTab = activeTab === "freelancers";

    const handleUserClick = (user) => {
        if (!isFreelancerTab) return;
        navigate(`/admin/freelancers/${user.id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                            #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Id
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
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
                            <td
                                colSpan={5}
                                className="px-6 py-6 text-sm text-red-600"
                            >
                                Failed to load users. Please check your token / API URL and
                                try again.
                            </td>
                        </tr>
                    )}

                    {!loading && !err && visible.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-6 py-6 text-sm text-gray-500"
                            >
                                No users found.
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        !err &&
                        visible.map((u, index) => (
                            <tr
                                key={u.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {u.initials}
                                        </div>
                                        <div className="ml-4">
                                            <div
                                                key={u.id}
                                                onClick={() => handleUserClick(u)}
                                                className={
                                                    "text-black hover:underline " +
                                                    (isFreelancerTab ? "cursor-pointer" : "cursor-default")}
                                            >
                                                {u.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {u.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {u.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Dropdown
                                        menu={{ items: menuItems(u), onClick: handleMenuClick(u) }}
                                        trigger={["click"]}
                                        placement="bottomRight"
                                        getPopupContainer={() => document.body}
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
    );
}
