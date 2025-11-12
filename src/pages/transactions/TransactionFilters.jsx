import React from "react";
import { Calendar, Filter, ChevronDown } from "lucide-react";
import { pad2 } from "../../features/transaction/utils";

const TransactionFilters = ({
    showing,
    total,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortBy,
    setSortBy,
}) => {
    

    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-indigo-600">
                        Latest actions (Showing {pad2(showing.start)} to {pad2(showing.end)} of {total})
                    </span>

                    {/* Date from – calendar input */}
                    <label className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Calendar className="w-4 h-4" />
                        <span>Date from</span>
                        <input
                            type="date"
                            className="ml-2 border-none bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                            value={dateFrom}
                            max={dateTo || undefined}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </label>

                    {/* Date to – calendar input */}
                    <label className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Calendar className="w-4 h-4" />
                        <span>Date to</span>
                        <input
                            type="date"
                            className="ml-2 border-none bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                            value={dateTo}
                            min={dateFrom || undefined}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </label>
                </div>

                {/* newest / oldest selector, wired to sortBy */}
                <div>
                    <select
                        className="text-sm text-black border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;
