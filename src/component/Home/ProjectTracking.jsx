import React, { useState, useEffect } from "react";
import { fetchData } from "../../common/axiosInstance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
    { month: 'Jan', value: 40, secondaryValue: 30 },
    { month: 'Feb', value: 80, secondaryValue: 55 },
    { month: 'Mar', value: 25, secondaryValue: 20 },
    { month: 'Mar', value: 50, secondaryValue: 35 },
    { month: 'Mar', value: 105, secondaryValue: 70 },
    { month: 'Apr', value: 45, secondaryValue: 35 },
    { month: 'Apr', value: 30, secondaryValue: 25 },
    { month: 'Apr', value: 60, secondaryValue: 45 },
    { month: 'May', value: 80, secondaryValue: 55 },
    { month: 'May', value: 20, secondaryValue: 15 },
    { month: 'Jun', value: 60, secondaryValue: 40 },
    { month: 'Jun', value: 50, secondaryValue: 35 },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-xs text-gray-400 mb-1">10 Mar 22</p>
                <p className="text-lg font-semibold">${payload[0].value.toLocaleString()}.00</p>
            </div>
        );
    }
    return null;
};

const ProjectTracking = () => {
    const [projects, setProjects] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [selectedYear, setSelectedYear] = useState('2025');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await fetchData("/projects/all");
                const projectsArray = Array.isArray(data) ? data : data?.projects || [];
                setProjects(projectsArray.slice(0, 5));
                setTotalProjects(data?.total || projectsArray.length); // total gigs count
                console.log("Fetched projects:", data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setProjects([]);
                setTotalProjects(0);
            }
        };
        fetchProjects();
    }, []);




    return (
        <div className="flex flex-1 gap-6 pt-8">

            {/* Active projects */}
            <div className="bg-white rounded-xl p-8 shadow-sm w-2/3">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Active Projects</h2>
                    <p className="text-gray-700 text-2xl font-medium">
                        Total Gig: <span className="text-gray-900 text-2xl font-semibold">{totalProjects}</span>
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-700">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-600 text-sm font-medium">
                                <th className="py-3 px-4">Seller Id</th>
                                <th className="py-3 px-4">Image</th>
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Categories</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Seller Id */}
                                    <td className="py-3 px-4 text-gray-800">
                                        {project.id ? `${project.id}` : "N/A"}
                                    </td>

                                    {/* Image */}
                                    <td className="py-3 px-4">
                                        <img
                                            src={
                                                project.images?.[0]
                                                    ? `${import.meta.env.VITE_API_URL}/${project.images[0]}`
                                                    : "https://via.placeholder.com/60"
                                            }
                                            alt={project.name}
                                            className="w-12 h-12 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/60";
                                            }}
                                        />
                                    </td>

                                    {/* Name */}
                                    <td className="py-3 px-4 font-medium text-gray-900 truncate max-w-xs">
                                        {project.name?.length > 60
                                            ? project.name.slice(0, 60) + "..."
                                            : project.name}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 px-4 text-gray-800">
                                        {project.status ? `${project.status}` : "N/A"}
                                    </td>

                                    {/* Currency */}
                                    <td className="py-3 px-4 text-gray-800">
                                        {project.currency ? `${project.currency}` : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* right side */}
            <div className="bg-white rounded-xl p-8 shadow-sm w-1/3">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Yearly Transaction</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="text-gray-700 font-medium">{selectedYear}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 14 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 14 }}
                                ticks={[0, 20, 40, 60, 80, 100, 120, 140]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Line
                                type="monotone"
                                dataKey="secondaryValue"
                                stroke="#e5e7eb"
                                strokeWidth={2}
                                dot={false}
                                activeDot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6, fill: '#3b82f6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProjectTracking;