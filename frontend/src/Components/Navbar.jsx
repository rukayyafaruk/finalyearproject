import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { School, Search, Scale, LayoutDashboard, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(22,53,38,0.08)] border-b border-warm-100'
                    : 'bg-white/80 backdrop-blur-sm border-b border-warm-100/60'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/images/kindred-path-mark.webp"
                            alt=""
                            className="h-11 w-11 rounded-xl bg-white object-contain p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="leading-none">
                            <div className="flex items-center gap-1.5">
                                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors sm:text-xl">
                                    KINDRED PATH
                                </span>
                                <span className="hidden text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 sm:inline">
                                    Portal
                                </span>
                            </div>
                            <div className="hidden text-[11px] text-slate-500 font-medium tracking-normal mt-0.5 sm:block">
                                Schools & Academies Guide
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1.5">
                        <Link
                            href={route('schools.index')}
                            className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 transition-all flex items-center gap-2"
                        >
                            <Search className="w-4 h-4 text-emerald-600" />
                            <span>Browse Schools</span>
                        </Link>
                        <Link
                            href={route('schools.index', { location: 'Kano' })}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-all flex items-center gap-1.5 border border-slate-200/80"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Kano Directory</span>
                        </Link>
                        <Link
                            href={route('schools.compare')}
                            className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:text-amber-800 hover:bg-amber-50/70 transition-all flex items-center gap-2"
                        >
                            <Scale className="w-4 h-4 text-amber-500" />
                            <span>Compare Matrix</span>
                        </Link>
                    </div>

                    {/* Auth Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth?.user ? (
                            <div className="flex items-center gap-2">
                                {/* User avatar pill */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-100">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-forest-500 to-gold-500 flex items-center justify-center text-white text-[10px] font-bold">
                                        {auth.user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-xs font-medium text-forest-800 max-w-[100px] truncate">
                                        {auth.user.name?.split(' ')[0]}
                                    </span>
                                </div>

                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-forest-600 hover:bg-forest-500 text-white transition-all shadow-forest flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>
                                        {auth.user.role === 'admin'
                                            ? 'Admin Panel'
                                            : auth.user.role === 'school'
                                            ? 'School Workspace'
                                            : 'My Dashboard'}
                                    </span>
                                </Link>

                                <div className="flex items-center gap-1 border-l border-warm-200 pl-2">
                                    <Link
                                        href={route('profile.edit')}
                                        className="p-2 rounded-lg text-warm-500 hover:text-forest-700 hover:bg-forest-50 transition-colors"
                                        title="Profile Settings"
                                    >
                                        <User className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="p-2 rounded-lg text-warm-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2 text-sm font-bold rounded-xl bg-slate-900 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Explore Free
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex md:hidden p-2 rounded-xl text-warm-600 hover:text-forest-800 hover:bg-forest-50 transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen
                            ? <X className="w-5 h-5" />
                            : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="border-t border-warm-100 bg-white px-4 pt-4 pb-6 space-y-2">
                    <Link
                        href={route('schools.index')}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-forest-800 hover:bg-forest-50 font-medium transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Search className="w-4 h-4 text-forest-500" />
                        Browse Schools
                    </Link>
                    <Link
                        href={route('schools.compare')}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-forest-800 hover:bg-forest-50 font-medium transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Scale className="w-4 h-4 text-gold-500" />
                        Compare Schools
                    </Link>

                    <div className="pt-3 border-t border-warm-100 space-y-2">
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-100 font-semibold transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-forest-600" />
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-warm-700 hover:bg-warm-50 font-medium transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <User className="w-4 h-4" />
                                    Profile Settings
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="block text-center px-4 py-3 rounded-xl font-medium text-forest-800 bg-forest-50 hover:bg-forest-100 transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block text-center px-4 py-3 rounded-xl font-semibold text-white bg-forest-600 hover:bg-forest-500 transition-colors shadow-forest"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Create Free Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
