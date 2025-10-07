import React, { useState } from 'react';
import { BarChart3, FileText, ShoppingCart, Package, Settings, HelpCircle, LogOut, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { fetchData } from '../common/axiosInstance';

const Home = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [gigs, setGigs] = useState([]);

    React.useEffect(() => {
        const fetchGigs = async () => {
            try {
                const data = await fetchData("/gigs/all");
                setGigs(Array.isArray(data) ? data : data?.gigs || []);
                console.log("Fetched gigs:", data);
            } catch (error) {
                console.error("Failed to fetch gigs:", error);
                setGigs([]);
            }
        };
        fetchGigs();
    }, []);

    const salesData = [
        { month: 'Jan', value: 25000 },
        { month: 'Feb', value: 32000 },
        { month: 'Mar', value: 28000 },
        { month: 'Apr', value: 22000 },
        { month: 'May', value: 45000 },
        { month: 'Jun', value: 42580 },
        { month: 'Jul', value: 38000 },
        { month: 'Aug', value: 35000 },
        { month: 'Sep', value: 48000 }
    ];

    const maxValue = Math.max(...salesData.map(d => d.value));

    const gigOrders = [
        { orderNo: '#1024ab', gig: 'Logo Design for Startup', client: 'Emily Carter', price: '$120', status: 'Completed' },
        { orderNo: '#1025cs', gig: 'SEO Optimization for Website', client: 'Michael Lee', price: '$85', status: 'In Progress' },
        { orderNo: '#1026rt', gig: 'Social Media Ad Campaign', client: 'Sophia Miller', price: '$200', status: 'Cancelled' },
        { orderNo: '#1027qp', gig: 'WordPress Landing Page', client: 'Daniel Smith', price: '$150', status: 'Completed' },
        { orderNo: '#1028mn', gig: 'Product Photography Edit', client: 'Laura Adams', price: '$95', status: 'In Progress' }
    ];

    const projectOrders = [
        { orderNo: '#501prj', project: 'E-Commerce Website Development', client: 'Olivia Johnson', price: '$2,800', status: 'Ongoing' },
        { orderNo: '#502prj', project: 'Mobile App UI/UX Design', client: 'Liam Williams', price: '$1,450', status: 'Completed' },
        { orderNo: '#503prj', project: 'Brand Identity & Guidelines', client: 'Sophia Davis', price: '$950', status: 'Pending' },
        { orderNo: '#504prj', project: 'Digital Marketing Strategy', client: 'Ethan Brown', price: '$1,200', status: 'Ongoing' },
        { orderNo: '#505prj', project: 'Portfolio Website Redesign', client: 'Ava Wilson', price: '$1,050', status: 'Completed' }
    ];

    const navItems = [
        { icon: BarChart3, label: 'Overview', id: 'overview' },
        { icon: FileText, label: 'Transaction', id: 'transaction' },
        { icon: FileText, label: 'Order Summary', id: 'summary' }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Deshwork</h1>
                </div>

                <nav className="flex-1 px-3">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === item.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <div className="border-t border-gray-700 my-4"></div>

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <HelpCircle size={20} />
                        <span>Support & Help</span>
                    </button>
                </nav>

                <button className="flex items-center gap-3 px-7 py-4 hover:bg-gray-800 transition-colors">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-1'>
                            <MdOutlineDashboardCustomize className='text-gray-900 w-5 h-5' />
                            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <nav className="flex gap-6">
                                <a href="#" className="text-gray-600 hover:text-gray-900">Super Admin</a>
                                <a href="#" className="text-gray-600 hover:text-gray-900">Admin</a>
                                <a href="#" className="text-gray-600 hover:text-gray-900">Finance</a>
                                <a href="#" className="text-gray-600 hover:text-gray-900">Customer Support</a>
                            </nav>
                            <div className="flex items-center gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="David Taylor" className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">David Taylor</div>
                                    <div className="text-xs text-gray-500">Sales Manager</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {/* Daily */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="text-purple-600" size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">Daily Transaction</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">$452</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-green-500 text-sm font-medium">+5.4%</span>
                                        <div className="flex gap-0.5">
                                            <div className="w-1 bg-gray-200 h-8 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-6 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-10 rounded"></div>
                                            <div className="w-1 bg-green-500 h-12 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Increase daily transaction by 5.4% from last day</p>
                                </div>
                            </div>
                        </div>

                        {/* Monthly */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="text-blue-600" size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">Monthly Transaction</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">$257,9</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-green-500 text-sm font-medium">+3.7%</span>
                                        <div className="flex gap-0.5">
                                            <div className="w-1 bg-gray-200 h-8 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-6 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-10 rounded"></div>
                                            <div className="w-1 bg-green-500 h-12 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Increase monthly transaction by 3.7% from last month</p>
                                </div>
                            </div>
                        </div>

                        {/* Yearly */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="text-orange-600" size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">Yearly Transaction</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">$357,95</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-green-500 text-sm font-medium">+3.7%</span>
                                        <div className="flex gap-0.5">
                                            <div className="w-1 bg-gray-200 h-8 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-6 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-10 rounded"></div>
                                            <div className="w-1 bg-green-500 h-12 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Increase Yearly transaction by 4.7% from last month</p>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="text-green-600" size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">Total</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">5382.00</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-red-500 text-sm font-medium">+6.3%</span>
                                        <div className="flex gap-0.5">
                                            <div className="w-1 bg-gray-200 h-10 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-12 rounded"></div>
                                            <div className="w-1 bg-red-500 h-8 rounded"></div>
                                            <div className="w-1 bg-gray-200 h-6 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Increase total by 6.3% from last Year</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Show gigs */}
                    <div className='mb-8'>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl text-gray-900 font-medium">Active Gigs</span>
                            </div>
                            <div>
                                {gigs.map((gig) => (
                                    console.log(gig),
                                    <div key={gig._id} className="mb-4 p-4 border rounded-lg shadow-md">
                                        <h4 className="text-lg font-semibold text-gray-900">{gig.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{gig.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">Price: ${gig.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-8">
                            {/* Performance Chart */}
                            <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Performance</h3>
                                    <p className="text-sm text-gray-500">You can see monthly performance from here</p>
                                </div>

                                <div className="relative h-64">
                                    <svg className="w-full h-full" viewBox="0 0 800 250">
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0.05" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid lines */}
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <line
                                                key={i}
                                                x1="60"
                                                y1={40 + i * 35}
                                                x2="750"
                                                y2={40 + i * 35}
                                                stroke="#f0f0f0"
                                                strokeWidth="1"
                                            />
                                        ))}

                                        {/* Y-axis labels */}
                                        {['50k', '40k', '30k', '20k', '10k', '0'].map((label, i) => (
                                            <text key={i} x="30" y={45 + i * 35} fontSize="12" fill="#999" textAnchor="end">
                                                {label}
                                            </text>
                                        ))}

                                        {/* X-axis labels */}
                                        {salesData.map((d, i) => (
                                            <text
                                                key={i}
                                                x={90 + i * 75}
                                                y="230"
                                                fontSize="12"
                                                fill="#999"
                                                textAnchor="middle"
                                            >
                                                {d.month}
                                            </text>
                                        ))}

                                        {/* Area under curve */}
                                        <path
                                            d={`M 90,${215 - (salesData[0].value / maxValue) * 175} ${salesData.map((d, i) =>
                                                `L ${90 + i * 75},${215 - (d.value / maxValue) * 175}`
                                            ).join(' ')} L ${90 + (salesData.length - 1) * 75},215 L 90,215 Z`}
                                            fill="url(#gradient)"
                                        />

                                        {/* Line */}
                                        <path
                                            d={`M 90,${215 - (salesData[0].value / maxValue) * 175} ${salesData.map((d, i) =>
                                                `L ${90 + i * 75},${215 - (d.value / maxValue) * 175}`
                                            ).join(' ')}`}
                                            fill="none"
                                            stroke="rgb(74, 222, 128)"
                                            strokeWidth="3"
                                        />

                                        {/* Data points */}
                                        {salesData.map((d, i) => {
                                            const x = 90 + i * 75;
                                            const y = 215 - (d.value / maxValue) * 175;
                                            return (
                                                <g key={i}>
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r="6"
                                                        fill="rgb(74, 222, 128)"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                    />
                                                    <line
                                                        x1={x}
                                                        y1={y}
                                                        x2={x}
                                                        y2="220"
                                                        stroke="#999"
                                                        strokeWidth="1"
                                                        strokeDasharray="4"
                                                    />
                                                    <title>{`${d.month}: $${d.value.toLocaleString()}`}</title>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>
                            </div>

                            {/* View Insights */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">View Insights</h3>
                                    <p className="text-sm text-gray-500">There are more to view</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 size={18} className="text-gray-600" />
                                            <span className="text-sm font-medium text-gray-900">Order complete ratio</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 size={18} className="text-gray-600" />
                                            <span className="text-sm font-medium text-gray-900">Invoice analysis</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500 mb-3">Insights created by</div>

                                <div className="bg-gray-50 rounded-xl p-6 text-center">
                                    <svg className="w-32 h-32 mx-auto mb-4" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" fill="white" />
                                        <circle cx="45" cy="50" r="8" fill="black" />
                                        <circle cx="75" cy="50" r="8" fill="black" />
                                        <path d="M 40 70 Q 60 80 80 70" stroke="black" strokeWidth="2" fill="none" />
                                        <rect x="30" y="35" width="15" height="3" fill="black" />
                                        <rect x="75" y="35" width="15" height="3" fill="black" />
                                    </svg>

                                    <h4 className="font-bold text-gray-900 mb-2">Explore More!</h4>
                                    <p className="text-xs text-gray-500 mb-4">
                                        It transforms data into a strategic asset, allowing you to stay ahead in revenue generation, team optimization, and project delivery
                                    </p>

                                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                        Upgrade
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Gigs Orders */}
                        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Gigs Orders</h3>

                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b">
                                        <th className="pb-3 font-medium">Order No.</th>
                                        <th className="pb-3 font-medium">Gig</th>
                                        <th className="pb-3 font-medium">Client</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gigOrders.map((order, i) => (
                                        <tr key={i} className="border-b last:border-b-0">
                                            <td className="py-4 text-sm text-gray-900">{order.orderNo}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.gig}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.client}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.price}</td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Completed'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : order.status === 'In Progress'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-200 text-red-500'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Recent Projects Orders */}
                        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Projects Orders</h3>

                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b">
                                        <th className="pb-3 font-medium">Order No.</th>
                                        <th className="pb-3 font-medium">Project</th>
                                        <th className="pb-3 font-medium">Client</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectOrders.map((order, i) => (
                                        <tr key={i} className="border-b last:border-b-0">
                                            <td className="py-4 text-sm text-gray-900">{order.orderNo}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.project}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.client}</td>
                                            <td className="py-4 text-sm text-gray-900">{order.price}</td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Completed'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : order.status === 'Ongoing'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-purple-200 text-purple-500'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;