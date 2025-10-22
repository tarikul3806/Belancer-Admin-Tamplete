import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { fetchData } from "../../common/axiosInstance";

// date accepted helpers
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const label = (d) => d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
const startOfMonth = (year, monthIdx) => new Date(year, monthIdx, 1);
const endOfMonth = (year, monthIdx) => new Date(year, monthIdx + 1, 0);
const daysInRange = (from, to) => {
    const out = [];
    const cur = new Date(from);
    cur.setHours(0, 0, 0, 0);
    const stop = new Date(to);
    stop.setHours(0, 0, 0, 0);
    while (cur <= stop) {
        out.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return out;
};
const pickDate = (obj, fields = ["created_at", "date_created", "createdAt"]) => {
    for (const f of fields) {
        if (obj?.[f]) {
            const d = new Date(obj[f]);
            if (!isNaN(d)) return d;
        }
    }
    return null;
};
const isInMonthYear = (date, year, monthIdx) =>
    date && date.getFullYear() === year && date.getMonth() === monthIdx;

// pagination-safe fetcher
const toPath = (url) => { try { const u = new URL(url); return u.pathname + u.search; } catch { return url; } };
const normalizeArray = (payload, keys) => {
    if (Array.isArray(payload)) return payload;
    for (const k of keys) if (Array.isArray(payload?.[k])) return payload[k];
    return [];
};
const fetchAllItems = async (basePath, arrayKeys) => {
    let first = await fetchData(`${basePath}?limit=1000`);
    let all = normalizeArray(first, arrayKeys);
    let next = first?.next;
    while (next) {
        const page = await fetchData(toPath(next));
        all = all.concat(normalizeArray(page, arrayKeys));
        next = page?.next;
    }
    if (first?.total_pages && first?.page && first.page < first.total_pages) {
        for (let p = first.page + 1; p <= first.total_pages; p++) {
            const page = await fetchData(`${basePath}?page=${p}&limit=1000`);
            all = all.concat(normalizeArray(page, arrayKeys));
        }
    }
    return all;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const AdminPreview = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0..11
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // raw data (fetched once)
    const [projectsAll, setProjectsAll] = useState([]);
    const [gigsAll, setGigsAll] = useState([]);
    const [usersAll, setUsersAll] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [projects, gigs, usersRaw] = await Promise.all([
                    fetchAllItems("/projects/all", ["projects", "results", "data", "items"]),
                    fetchAllItems("/gigs/all", ["gigs", "results", "data", "items"]),
                    fetchData("/auth/admin/users"),
                ]);
                const users = Array.isArray(usersRaw) ? usersRaw : (usersRaw?.users || usersRaw || []);
                setProjectsAll(projects);
                setGigsAll(gigs);
                setUsersAll(users);
            } catch (e) {
                console.error("Fetch failed:", e);
                setProjectsAll([]); setGigsAll([]); setUsersAll([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // derive the month’s view whenever selection or raw data changes
    const { chartData, totals } = useMemo(() => {
        const mStart = startOfMonth(currentYear, selectedMonth);
        const mEnd = endOfMonth(currentYear, selectedMonth);

        const monthProjects = projectsAll.filter(p => isInMonthYear(pickDate(p), currentYear, selectedMonth));
        const monthGigs = gigsAll.filter(g => isInMonthYear(pickDate(g), currentYear, selectedMonth));
        const monthActiveUsers = usersAll.filter(u => {
            const created = pickDate(u, ["date_created", "created_at", "createdAt"]);
            const isActive = u?.is_verified === true || u?.is_active === true;
            return isActive && isInMonthYear(created, currentYear, selectedMonth);
        });

        const countByDay = (arr) => {
            const m = new Map();
            for (const it of arr) {
                const d = pickDate(it);
                if (!d || !isInMonthYear(d, currentYear, selectedMonth)) continue;
                const k = ymd(d);
                m.set(k, (m.get(k) || 0) + 1);
            }
            return m;
        };

        const projMap = countByDay(monthProjects);
        const gigMap = countByDay(monthGigs);
        const userMap = countByDay(monthActiveUsers);

        let projCum = 0, gigCum = 0, userCum = 0;
        const series = daysInRange(mStart, mEnd).map(d => {
            const k = ymd(d);
            projCum += projMap.get(k) || 0;
            gigCum += gigMap.get(k) || 0;
            userCum += userMap.get(k) || 0;
            return { date: label(d), allProjects: projCum, activeMembers: userCum, allGigs: gigCum };
        });

        return {
            chartData: series,
            totals: {
                projects: monthProjects.length,
                gigs: monthGigs.length,
                activeUsers: monthActiveUsers.length,
            },
        };
    }, [projectsAll, gigsAll, usersAll, selectedMonth, currentYear]);

    const StatCard = ({ title, value, icon, bgColor }) => (
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
                    <span className="text-green-500 font-medium">37.8%</span>
                    <span className="text-gray-500 ml-1">this week</span>
                </div>
            </div>
        </div>
    );

    // month options limited to current year; hide future months if current year is selected
    const monthOptions = useMemo(() => {
        const last = now.getMonth();
        return MONTHS.map((name, idx) => ({ name, idx, disabled: idx > last ? true : false }));
    }, []);

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
                        <StatCard title="Daily Transaction" value="1.6k" change="37.8%" bgColor="bg-pink-100"
                            icon={<svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" /></svg>} />
                        <StatCard title="Yearly Transaction" value="1.6k" change="37.8%" bgColor="bg-purple-100"
                            icon={<svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>} />
                    </div>

                    {/* Middle Column - More Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatCard title="Monthly Transaction" value="1.6k" change="37.8%" bgColor="bg-orange-100"
                            icon={<svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>} />
                        <StatCard title="Total" value="1.6k" change="37.8%" bgColor="bg-blue-100"
                            icon={<svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.46-.33.7-.66.7-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} />
                    </div>

                    {/* Right Column - Chart */}
                    <div className="lg:col-span-2 h-[376px] bg-white rounded-2xl p-6 shadow-sm relative">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Projects & Gig Overview</h3>
                                <p className="text-sm text-gray-500 mt-1">Audience to which the users lorem ipsum dolor sit amet</p>
                            </div>

                            {/* Month selector */}
                            <div className="relative">
                                <button
                                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(s => !s)}
                                >
                                    {MONTHS[selectedMonth]} ▾
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <ul className="max-h-72 overflow-auto py-1">
                                            {monthOptions.map(({ name, idx, disabled }) => (
                                                <li key={idx}>
                                                    <button
                                                        disabled={disabled}
                                                        onClick={() => { setSelectedMonth(idx); setIsMenuOpen(false); }}
                                                        className={`w-full text-left px-3 py-2 text-sm ${disabled ? 'text-gray-300 cursor-not-allowed' :
                                                            idx === selectedMonth ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* right-side counters (Monthly for selected month) */}
                        <div className="space-y-2 mb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">All Projects</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{totals.projects}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">Active Members</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{totals.activeUsers}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">All Gigs</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{totals.gigs}</span>
                            </div>
                        </div>

                        <div className="h-40">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading…</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="allProjects" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="activeMembers" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="allGigs" stroke="#ec4899" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPreview;
