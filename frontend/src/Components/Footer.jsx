import { Link } from '@inertiajs/react';
import { School, Heart, ShieldCheck, MapPin, Mail, Phone, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-forest-950 text-warm-300 text-sm relative overflow-hidden">
            {/* Decorative top border gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-forest-600 via-gold-500 to-forest-600" />

            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-5">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <img
                                src="/images/kindred-path-mark.webp"
                                alt=""
                                className="h-11 w-11 rounded-xl bg-white object-contain p-0.5 transition-transform group-hover:scale-[1.02]"
                            />
                            <div>
                                <div className="font-display font-bold text-xl text-white tracking-tight flex items-center gap-2">
                                    KINDRED PATH
                                    <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        Schools
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium tracking-wide">
                                    Nigeria's School Decision Platform
                                </div>
                            </div>
                        </Link>

                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            Empowering Nigerian families in Kano, Lagos, Abuja, and nationwide to discover, compare, and select accredited schools with authentic community reviews and verified tuition data.
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>100% Admin & Ministry Verified Listings</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <MapPin className="w-4 h-4 shrink-0 text-slate-500" />
                                <span>Kano Municipal Hub & Lagos Central, Nigeria</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Mail className="w-4 h-4 shrink-0 text-slate-500" />
                                <span>contact@rukysschools.ng</span>
                            </div>
                        </div>
                    </div>

                    {/* Explore Schools */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gold-400" />
                            Explore Schools
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            {[
                                { label: 'British Curriculum', params: { educational_system: 'British' } },
                                { label: 'American High Schools', params: { educational_system: 'American' } },
                                { label: 'Montessori Early Learning', params: { educational_system: 'Montessori' } },
                                { label: 'Boarding Colleges', params: { residential_status: 'Boarding' } },
                                { label: 'Government Model Schools', params: { ownership: 'Public' } },
                                { label: 'International Baccalaureate', params: { educational_system: 'IB' } },
                            ].map(({ label, params }) => (
                                <li key={label}>
                                    <Link
                                        href={route('schools.index', params)}
                                        className="flex items-center gap-1.5 text-warm-400 hover:text-gold-400 transition-colors group"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform Tools */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-forest-400" />
                            Platform Tools
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            {[
                                { label: 'School Directory & Filters', href: route('schools.index') },
                                { label: '3-Way Side-by-Side Comparison', href: route('schools.compare') },
                                { label: 'School Registration Portal', href: route('register') },
                                { label: 'Parent & School Dashboards', href: route('dashboard') },
                                { label: 'Campus Tour Booking', href: route('schools.index') },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="flex items-center gap-1.5 text-warm-400 hover:text-gold-400 transition-colors group"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div className="md:col-span-2">
                        <h4 className="text-white font-semibold text-sm mb-5">Quick Access</h4>
                        <div className="space-y-3">
                            <Link
                                href={route('register')}
                                className="block text-center px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold transition-colors shadow-forest"
                            >
                                Register a School
                            </Link>
                            <Link
                                href={route('login')}
                                className="block text-center px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 border border-forest-700 text-warm-300 text-xs font-medium transition-colors"
                            >
                                Parent Sign In
                            </Link>
                            <Link
                                href={route('schools.compare')}
                                className="block text-center px-4 py-2.5 rounded-xl bg-gold-900/40 hover:bg-gold-900/60 border border-gold-800/50 text-gold-400 text-xs font-medium transition-colors"
                            >
                                Compare Schools
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                    <p>© {new Date().getFullYear()} Kindred Path Schools Portal — All rights reserved.</p>
                    <div className="flex items-center gap-1.5">
                        <span>Crafted for Nigerian parents, students & educators</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
