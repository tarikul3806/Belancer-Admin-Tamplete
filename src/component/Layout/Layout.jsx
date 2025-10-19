import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Fixed Sidebar */}
            <aside className="w-64 bg-white border border-[#E8E8E8] text-[#202020] flex flex-col fixed inset-y-0 left-0">
                <Sidebar />
            </aside>

            {/* Scrollable Main Content */}
            <div className="flex-1 ml-64 flex flex-col overflow-y-auto bg-gray-50">
                <Navbar />
                <main className="p-6 bg-[#EFF6FC]">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
