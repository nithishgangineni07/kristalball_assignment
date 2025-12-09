import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, ArrowRightLeft, ShieldCheck, LogOut, Package, Menu } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 translate-x-1'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                    }`}
            >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                <span className="font-medium">{label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </Link>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900">
            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>

            {/* Sidebar */}
            <aside className="relative z-10 w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800 flex flex-col h-full shadow-2xl">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">MAMS</h1>
                            <p className="text-xs text-blue-400 font-medium tracking-wide">MILITARY DISPATCH</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 px-4 mb-2 uppercase tracking-wider">Main Menu</div>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                    {(user?.role === 'logistics' || user?.role === 'admin') && (
                        <>
                            <NavItem to="/purchases" icon={ShoppingCart} label="Acquisitions" />
                            <NavItem to="/transfers" icon={ArrowRightLeft} label="Transfers" />
                        </>
                    )}

                    {(user?.role === 'commander' || user?.role === 'admin') && (
                        <NavItem to="/assignments" icon={Package} label="Assignments" />
                    )}
                </nav>

                <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-400 capitalize truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 overflow-auto bg-slate-50/90 scroll-smooth">
                {/* Header Strip */}
                <header className="sticky top-0 z-20 px-8 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center transition-all">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Overview
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-500 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
