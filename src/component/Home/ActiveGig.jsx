import React, { useState, useEffect } from "react";
import { fetchData } from "../../common/axiosInstance";

const ActiveGig = () => {
    const [gigs, setGigs] = useState([]);
    const [totalGigs, setTotalGigs] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState('USA');

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                const data = await fetchData("/gigs/all");
                const gigsArray = Array.isArray(data) ? data : data?.gigs || [];
                setGigs(gigsArray.slice(0, 5));
                setTotalGigs(data?.total || gigsArray.length); // 👈 total gigs count
                console.log("Fetched gigs:", data);
            } catch (error) {
                console.error("Failed to fetch gigs:", error);
                setGigs([]);
                setTotalGigs(0);
            }
        };
        fetchGigs();
    }, []);


    const stateData = [
        { state: 'California', orders: 12202, sales: 150200 },
        { state: 'Texas', orders: 11950, sales: 147715 },
        { state: 'New York', orders: 11198, sales: 120322 },
        { state: 'Kansas', orders: 8560, sales: 102803 }
    ];

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    const formatCurrency = (num) => {
        return '$' + num.toLocaleString();
    };

    return (
        <div className="flex flex-1 gap-6 pt-8">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Traffic Channels</h2>
                    <div className="relative">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="USA">USA</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Map */}
                <div className="mb-8 bg-gray-50 rounded-lg">
                    <img className="h-fit" src="../../../src/assets/map/Maps.png" alt="" />
                </div>

                {/* Table Headers */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">States</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Orders</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Sales</div>
                </div>

                {/* Data Rows */}
                <div className="space-y-3">
                    {stateData.map((data, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="text-sm font-medium text-gray-900">{data.state}</div>
                            <div className="text-sm text-gray-700 text-right">{formatNumber(data.orders)}</div>
                            <div className="text-sm text-gray-900 font-medium text-right">{formatCurrency(data.sales)}</div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Active Gigs */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Active Gigs</h2>
                    <p className="text-gray-700 text-2xl font-medium">
                        Total Gig: <span className="text-gray-900 text-2xl font-semibold">{totalGigs}</span>
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
                            {gigs.map((gig, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Seller Id */}
                                    <td className="py-3 px-4 text-gray-800">
                                        {gig.seller_id ? `${gig.seller_id}` : "N/A"}
                                    </td>

                                    {/* Image */}
                                    <td className="py-3 px-4">
                                        <img
                                            src={
                                                gig.images?.[0]
                                                    ? `${import.meta.env.VITE_API_URL}/${gig.images[0]}`
                                                    : "https://via.placeholder.com/60"
                                            }
                                            alt={gig.title}
                                            className="w-12 h-12 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/60";
                                            }}
                                        />
                                    </td>

                                    {/* Title */}
                                    <td className="py-3 px-4 font-medium text-gray-900 truncate max-w-xs">
                                        {gig.title?.length > 60
                                            ? gig.title.slice(0, 60) + "..."
                                            : gig.title}
                                    </td>

                                    {/* Status */}
                                    <td className="py-3 px-4">
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                                            Active <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </span>
                                    </td>

                                    {/* Category */}
                                    <td className="py-3 px-4 text-gray-800">
                                        {gig.tags?.[0] || "Uncategorized"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActiveGig;