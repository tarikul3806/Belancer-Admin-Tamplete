import { Users, FileText, Settings } from 'lucide-react';
import { MdDashboard } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { FaRegHandshake } from "react-icons/fa";
import { MdOutlineInterpreterMode } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    const navItems = [
        { icon: MdDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Users', to: '/admin/users' },
        { icon: FileText, label: 'Projects', to: '/admin/projects' },
        { icon: FileText, label: 'Gigs', to: '/admin/gigs' },
        { icon: GrTransaction, label: 'Transaction', to: '/admin/transaction' },
        { icon: GrTransaction, label: 'Withdraw', to: '/admin/withdraw' },
        { icon: FaRegHandshake, label: 'Dispute', to: '/admin/dispute' },
        { icon: MdOutlineInterpreterMode, label: 'Applications', to: '/admin/applications' },
    ];


    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-6 border-b border-[#E8E8E8] h-[72px]">
                <GiHamburgerMenu className='h-6 w-6 text-[#84818A]' />
                <h1 className="text-2xl font-bold">Belancer</h1>
            </div>

            <nav className="flex-1 overflow-y-auto mt-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-4 py-3 mb-1 rounded transition-colors
                            ${isActive ? 'bg-[#0088FF] text-white' : 'hover:bg-[#0088FF] hover:text-white'}`
                        }
                    >
                        <item.icon className="text-current" size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <div className="border-t border-gray-700 my-4"></div>

                <button className="w-full flex items-center gap-3 px-4 py-3">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>

            </nav>
        </div>
    );
};

export default Sidebar;
