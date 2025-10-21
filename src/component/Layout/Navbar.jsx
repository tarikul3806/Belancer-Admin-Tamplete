import React from 'react';
import { LayoutGrid, Users, Briefcase, User, Bell } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import api from "../../common/axiosInstance";
import { isAdmin, clearToken } from "../../utils/auth";


export default function Navbar() {

    const loggedIn = isAdmin();
    const navigate = useNavigate();

    function logout() {
        clearToken();
        delete api.defaults.headers.common["Authorization"];
        navigate("/admin/login", { replace: true });
    }

    // const [activeTab, setActiveTab] = React.useState('Projects');

    // const navItems = [
    //     { id: 'Dashboard', icon: LayoutGrid, label: 'Dashboard' },
    //     { id: 'Projects', icon: Users, label: 'Projects' },
    //     { id: 'Gigs', icon: Briefcase, label: 'Gigs' },
    //     { id: 'Others', icon: User, label: 'Others' },
    // ];

    return (
        <nav className="bg-white border border-[#E8E8E8] w-full h-[72px]">
            <div className="flex items-center justify-end px-6 py-4">
                {/* Logo */}
                {/* <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">deshwork</h1>
                </div> */}

                {/* Navigation Items */}
                {/* <div className="flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-md transition-all
                                    ${isActive
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div> */}

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Bell Icon */}
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>

                    <div>
                        {loggedIn ? (
                            <button onClick={logout} className="border text-black px-2 py-1 rounded-lg">Log out</button>
                        ) : (
                            <Link to="/admin/login" className="border text-black px-2 py-1 rounded-lg">Log in</Link>
                        )}
                    </div>

                    {/* User Profile */}
                    {/* <div className="flex items-center gap-3">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                            alt="Akmal Hossain"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">Akmal Hossain</span>
                            <span className="text-xs text-gray-500">Admin</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </nav>
    );
}