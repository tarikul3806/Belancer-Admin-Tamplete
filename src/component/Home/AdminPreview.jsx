/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { fetchData } from "../../common/axiosInstance";
import useWithdrawStats from '../../features/transaction/useWithdrawStats';
import Daily from "../../assets/transaction_card/daily.png";
import Monthly from "../../assets/transaction_card/monthly.png";
import Yearly from "../../assets/transaction_card/yearly.png";
import Total from "../../assets/transaction_card/total.png";

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
const formatAmount = (n) =>
    Number(n || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

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
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // raw data (fetched once)
    const [projectsAll, setProjectsAll] = useState([]);
    const [gigsAll, setGigsAll] = useState([]);
    const [usersAll, setUsersAll] = useState([]);
    const [loading, setLoading] = useState(true);

    const { loading: statsLoading, error: statsError, counts, amounts } = useWithdrawStats();

    useEffect(() => {
        const load = async () => {
            try {
                const [projects, gigs, usersRaw] = await Promise.all([
                    fetchAllItems("/projects/all", ["projects", "results", "data", "items"]),
                    fetchAllItems("/gigs/all", ["gigs", "results", "data", "items"]),
                    fetchData("/auth/admin/users"),
                ]);
                const users = normalizeArray(usersRaw, ["users", "results", "data", "items"]);
                setUsersAll(users);

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

        const monthProjects = projectsAll?.filter(p => isInMonthYear(pickDate(p), currentYear, selectedMonth));
        const monthGigs = gigsAll?.filter(g => isInMonthYear(pickDate(g), currentYear, selectedMonth));
        const monthActiveUsers = usersAll?.filter(u => {
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

    const StatCard = ({ title, count, amount, icon }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                <img src={icon} alt={title} className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                {/* number of successful transactions */}
                <div className="text-3xl font-bold text-gray-900">
                    {statsLoading ? "—" : (count ?? 0)}
                </div>

                {/* total amount for that period */}
                <div className="text-sm text-gray-500">
                    {statsLoading
                        ? "Calculating…"
                        : `Total amount: ${formatAmount(amount ?? 0)}`}
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
                        <StatCard
                            title="Daily Transaction"
                            count={counts?.daily}
                            amount={amounts?.daily}
                            icon={Daily}
                        />
                        <StatCard
                            title="Yearly Transaction"
                            count={counts?.yearly}
                            amount={amounts?.yearly}
                            icon={Yearly}
                        />
                    </div>

                    {/* Middle Column - More Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatCard
                            title="Monthly Transaction"
                            count={counts?.monthly}
                            amount={amounts?.monthly}
                            icon={Monthly}
                        />
                        <StatCard
                            title="Total"
                            count={counts?.total}
                            amount={amounts?.total}
                            icon={Total}
                        />
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
