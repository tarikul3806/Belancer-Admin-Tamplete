import React from 'react';
import { TrendingUp, ShoppingCart } from 'lucide-react';

const StatsCards = () => {
    return (
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
        </div>
    );
};

export default StatsCards;