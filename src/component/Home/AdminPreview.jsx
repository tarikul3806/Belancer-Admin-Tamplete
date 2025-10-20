import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { fetchData } from "../../common/axiosInstance";

const AdminPreview = () => {
    const [totalGigs, setTotalGigs] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const data = await fetchData("/gigs/all");
                const gigsArray = Array.isArray(data) ? data : data?.gigs || [];
                setTotalGigs(data?.total || gigsArray.length); // total gigs count
                console.log("Fetched gigs:", data);
            } catch (error) {
                console.error("Failed to fetch gigs:", error);
                setTotalGigs(0);
            }
        };

        const fetchProjects = async () => {
            try {
                const data = await fetchData("/projects/all");
                const projectsArray = Array.isArray(data) ? data : data?.projects || [];
                setTotalProjects(data?.total || projectsArray.length); // total projects count
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setTotalProjects(0);
            }
        };
        fetchGigs();
        fetchProjects();
    }, []);

    const chartData = [
        { date: 'Dec10', allProjects: 2400, activeMembers: 400, allGigs: 1100 },
        { date: 'Dec14', allProjects: 2450, activeMembers: 420, allGigs: 1150 },
        { date: 'Dec18', allProjects: 2500, activeMembers: 450, allGigs: 1200 },
        { date: 'Dec22', allProjects: 2520, activeMembers: 430, allGigs: 1180 },
        { date: 'Dec26', allProjects: 2600, activeMembers: 460, allGigs: 1210 },
        { date: 'Dec30', allProjects: 2605, activeMembers: 478, allGigs: 1233 },
    ];

    const StatCard = ({ title, value, change, icon, bgColor }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                <div className={`${bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{change}</span>
                    <span className="text-gray-500 ml-1">this week</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Hi, Super Admin</h1>
                    <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Daily View ▼
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Stats Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatCard
                            title="Daily Transaction"
                            value="1.6k"
                            change="37.8%"
                            bgColor="bg-pink-100"
                            icon={
                                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Yearly Transaction"
                            value="1.6k"
                            change="37.8%"
                            bgColor="bg-purple-100"
                            icon={
                                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Middle Column - More Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatCard
                            title="Monthly Transaction"
                            value="1.6k"
                            change="37.8%"
                            bgColor="bg-orange-100"
                            icon={
                                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            }
                        />

                        <StatCard
                            title="Total"
                            value="1.6k"
                            change="37.8%"
                            bgColor="bg-blue-100"
                            icon={
                                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Right Column - Chart */}
                    <div className="lg:col-span-2 h-[376px] bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Projects & Gig Overview</h3>
                                <p className="text-sm text-gray-500 mt-1">Audience to which the users lorem ipsum dolor sit amet</p>
                            </div>
                            <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                                This Month ▼
                            </button>
                        </div>

                        <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">All Projects</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{totalProjects}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">Active Members</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">78</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">All Gigs</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{totalGigs}</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="allProjects"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="activeMembers"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="allGigs"
                                    stroke="#ec4899"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPreview;