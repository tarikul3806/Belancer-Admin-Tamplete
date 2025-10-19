import { BarChart3, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';
import { MdDashboard } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { useState } from 'react';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const navItems = [
        { icon: MdDashboard, label: 'Dashboard', id: 'Dashboard' },
        { icon: FileText, label: 'Projects', id: 'Projects' },
        { icon: FileText, label: 'Gigs', id: 'Gigs' },
        { icon: GrTransaction, label: 'Transaction', id: 'Transaction' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-6 border-b border-[#E8E8E8] h-[72px]">
                <GiHamburgerMenu className='h-6 w-6 text-[#84818A]' />
                <h1 className="text-2xl font-bold">Belancer</h1>
            </div>

            <nav className="flex-1 overflow-y-auto mt-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${activeTab === item.id ? 'bg-[#0088FF] text-white' : 'hover:bg-[#0088FF]'
                            }`}
                    >
                        <item.icon
                            className={`${activeTab === item.id ? 'text-white' : 'text-[#84818A]'}`}
                            size={20}
                        />
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="border-t border-gray-700 my-4"></div>

                <button className="w-full flex items-center gap-3 px-4 py-3">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>

            </nav>

            <button className="flex items-center gap-3 px-7 py-4 hover:bg-gray-800 transition-colors">
                <LogOut size={20} />
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default Sidebar;
