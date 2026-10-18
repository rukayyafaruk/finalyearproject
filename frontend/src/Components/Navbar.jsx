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
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-forest-600 via-forest-500 to-gold-500 flex items-center justify-center shadow-forest transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                            <School className="w-5 h-5 text-white" />
                            {/* Subtle shimmer on hover */}
                            <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                        </div>
                        <div className="leading-none">
                            <div className="font-display font-bold text-lg text-forest-900 tracking-tight group-hover:text-forest-700 transition-colors">
                                EduSelect
                            </div>
                            <div className="text-[10px] text-warm-500 font-medium tracking-wide -mt-0.5">
                                School Selection Portal
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href={route('schools.index')}
                            className="nav-link group"
                        >
                            <Search className="w-4 h-4 text-forest-500 group-hover:text-forest-700 transition-colors" />
                            <span>Browse Schools</span>
                        </Link>
                        <Link
                            href={route('schools.compare')}
                            className="nav-link group"
                        >
                            <Scale className="w-4 h-4 text-gold-500 group-hover:text-gold-600 transition-colors" />
                            <span>Compare</span>
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
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-sm font-medium rounded-xl text-forest-700 hover:text-forest-900 hover:bg-forest-50 border border-transparent hover:border-forest-200 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="btn-primary !py-2 !px-5 !text-sm"
                                >
                                    Get Started Free
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
