import React from "react";

const TransactionHeader = () => {
    return (
        <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Transactions</h1>
            <p className="text-sm text-gray-500">
                List of deposits & withdrawals done by Investor
            </p>
        </div>
    );
};

export default TransactionHeader;
