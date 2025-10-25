import React, { useState } from 'react';
import { Search, SlidersHorizontal, Settings, Download, ChevronRight, ShoppingBag, DollarSign, User, Calendar, CreditCard, Mail } from 'lucide-react';

const Transaction = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const transactions = [
        {
            id: 'AR-47380416-61',
            product: 'Meta Quest 3',
            specs: '512Gb • White',
            price: '$499.00',
            customer: 'Liam Smith',
            avatar: 'LS',
            date: '02 Apr 2025, 8:15 am',
            paymentMethod: 'VISA',
            cardLast4: '4321',
            avatarColor: 'bg-cyan-500'
        },
        {
            id: 'AR-30631995-17',
            product: 'iPhone 15 Pro Max',
            specs: '512Gb • eSIM',
            price: '$1,399.00',
            customer: 'Lily Thompson',
            avatar: 'LT',
            date: '06 Apr 2025, 6:45 pm',
            paymentMethod: 'Mastercard',
            cardLast4: '8890',
            avatarColor: 'bg-pink-500'
        },
        {
            id: 'AR-79609316-32',
            product: 'MacBook Air M3 (13")',
            specs: 'M3 chip • Ultra-light',
            price: '$1,299.00',
            customer: 'Lucas Young',
            avatar: 'LY',
            date: '10 Apr 2025, 11:30 am',
            paymentMethod: 'VISA',
            cardLast4: '1023',
            avatarColor: 'bg-emerald-500'
        },
        {
            id: 'AR-17288760-13',
            product: 'AirPods Pro',
            specs: '2nd Gen • USB-C case',
            price: '$229.00',
            customer: 'Isabella Garcia',
            avatar: 'IG',
            date: '14 Apr 2025, 7:50 pm',
            paymentMethod: 'VISA',
            cardLast4: '5678',
            avatarColor: 'bg-amber-500'
        },
        {
            id: 'AR-24593385-96',
            product: 'Apple Vision Pro',
            specs: 'AR Headset',
            price: '$3,499.00',
            customer: 'Amelia Davis',
            avatar: 'AD',
            date: '18 Apr 2025, 9:05 am',
            paymentMethod: 'Mastercard',
            cardLast4: '3301',
            avatarColor: 'bg-purple-500'
        },
        {
            id: 'AR-57722590-75',
            product: 'Oura Ring 4',
            specs: 'Health Wearable',
            price: '$399.00',
            customer: 'Caleb Turner',
            avatar: 'CT',
            date: '22 Apr 2025, 10:10 pm',
            paymentMethod: 'Stripe',
            cardLast4: '9823',
            avatarColor: 'bg-pink-500'
        },
        {
            id: 'AR-70604520-23',
            product: 'Nintendo Switch 2',
            specs: '120FPS, Joy-Con 2',
            price: '$399.00',
            customer: 'Noah Anderson',
            avatar: 'NA',
            date: '26 Apr 2025, 1:40 pm',
            paymentMethod: 'Custom',
            cardLast4: '7745',
            avatarColor: 'bg-cyan-500'
        },
        {
            id: 'AR-53004255-46',
            product: 'Google Nest Hub Max',
            specs: 'Voice assistant • Display',
            price: '$199.00',
            customer: 'Olivia Brown',
            avatar: 'OB',
            date: '30 Apr 2025, 4:00 pm',
            paymentMethod: 'Mastercard',
            cardLast4: '7924',
            avatarColor: 'bg-blue-500'
        },
        {
            id: 'AR-530042692-40',
            product: 'JBL Flip 6 Speaker',
            specs: 'Waterproof • Bluetooth',
            price: '$119.00',
            customer: 'Violet Hawkins',
            avatar: 'VH',
            date: '04 May 2025, 3:25 am',
            paymentMethod: 'VISA',
            cardLast4: '1102',
            avatarColor: 'bg-green-500'
        }
    ];

    const filteredTransactions = transactions.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const PaymentIcon = ({ method, last4 }) => {
        if (method === 'VISA') {
            return (
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">VISA</div>
                    <span className="text-gray-400">•••• {last4}</span>
                </div>
            );
        } else if (method === 'Mastercard') {
            return (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                        <div className="w-5 h-5 rounded-full bg-red-500 opacity-80"></div>
                        <div className="w-5 h-5 rounded-full bg-orange-400 opacity-80 -ml-2"></div>
                    </div>
                    <span className="text-gray-400">•••• {last4}</span>
                </div>
            );
        } else if (method === 'Stripe') {
            return (
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 text-white px-2 py-0.5 rounded text-xs font-semibold">stripe</div>
                    <span className="text-gray-400">•••• {last4}</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
                    <span className="text-gray-400">•••• {last4}</span>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 p-6">
            <div className="max-w-full overflow-x-auto">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">Recent Transaction</h1>
                        <span className="bg-gray-100 text-black px-2.5 py-0.5 rounded-full text-sm">24</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gray-700 w-64"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm">
                            <SlidersHorizontal className="w-4 h-4" />
                            Hide
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm">
                            <Settings className="w-4 h-4" />
                            Customize
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="min-w-[900px] grid grid-cols-6 gap-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5" /> Order ID
                    </div>
                    <div>Product Item</div>
                    <div>Price</div>
                    <div>Customer</div>
                    <div>Date Checkout</div>
                    <div>Payment</div>
                </div>

                {/* Transaction Rows */}
                <div className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="min-w-[900px] grid grid-cols-6 gap-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                            {/* Order ID */}
                            <div className="flex items-center gap-2">
                                <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 border border-gray-300 hover:bg-gray-200">
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                                <span className="text-sm text-gray-700">{transaction.id}</span>
                            </div>

                            {/* Product */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{transaction.product}</div>
                                    <div className="text-xs text-gray-500">{transaction.specs}</div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center text-sm font-semibold">{transaction.price}</div>

                            {/* Customer */}
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 ${transaction.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                                >
                                    {transaction.avatar}
                                </div>
                                <span className="text-sm">{transaction.customer}</span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center text-sm">{transaction.date}</div>

                            {/* Payment */}
                            <div className="flex items-center text-sm">
                                <PaymentIcon method={transaction.paymentMethod} last4={transaction.cardLast4} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Transaction;