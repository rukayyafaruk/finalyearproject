import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { schoolsApi } from '@/api/client';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import CompareFloatingBar from '@/Components/CompareFloatingBar';
import { useUserLocation } from '@/hooks/useUserLocation';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';
import {
    Search, MapPin, Scale, ShieldCheck, GraduationCap,
    BookOpen, Compass, Award, Users, ArrowRight, CheckCircle2,
    Building2, Sparkles, SlidersHorizontal, Star, TrendingUp,
    Heart, ChevronRight, BadgeCheck, Navigation, X, Loader2,
    Check, School as SchoolIcon, Layers, Clock, Globe
} from 'lucide-react';

/* ─── Intersection Observer hook for scroll animations ─── */
function useScrollAnimation() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

/* ─── Animated stat counter ─── */
function StatCounter({ end, suffix = '', prefix = '', duration = 1800 }) {
    const [count, setCount] = useState(0);
    const { ref, visible } = useScrollAnimation();

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const target = Number(end) || 0;
        if (target === 0) return;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setCount(Math.floor(start));
            if (start >= target) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [visible, end, duration]);

    return (
        <span ref={ref}>
            {prefix}{visible ? count : 0}{suffix}
        </span>
    );
}

/* ─── Animated section wrapper ─── */
function AnimatedSection({ children, className = '', delay = 0 }) {
    const { ref, visible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function Welcome(props) {
    const [homeData, setHomeData] = useState({
        featuredSchools: props.featuredSchools || [],
        stats: props.stats || {},
        availableLocations: props.availableLocations || [],
    });

    useEffect(() => {
        if (!props.featuredSchools || props.featuredSchools.length === 0) {
            schoolsApi.getHome()
                .then((res) => {
                    if (res.data) {
                        setHomeData({
                            featuredSchools: res.data.featuredSchools || [],
                            stats: res.data.stats || {},
                            availableLocations: res.data.availableLocations || [],
                        });
                    }
                })
                .catch(console.error);
        }
    }, [props.featuredSchools]);

    const { featuredSchools, stats, availableLocations } = homeData;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSystem, setSelectedSystem] = useState('');
    const [heroVisible, setHeroVisible] = useState(false);
    const [locationBannerDismissed, setLocationBannerDismissed] = useState(false);
    const [locationApplied, setLocationApplied] = useState(false);
    const [schoolCategoryTab, setSchoolCategoryTab] = useState('all');
    const [compareToast, setCompareToast] = useState(null);

    // ── Automatic location detection ──────────────────────────────────────
    const { location: userLocation, detect: detectLocation } = useUserLocation(
        availableLocations,
        { autoDetect: true }
    );

    useEffect(() => {
        if (
            userLocation.status === 'resolved' &&
            userLocation.matched &&
            !locationApplied &&
            !selectedLocation
        ) {
            setSelectedLocation(userLocation.matched);
            setLocationApplied(true);
        }
    }, [userLocation.status, userLocation.matched, locationApplied, selectedLocation]);

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('schools.index'), {
            search: searchQuery,
            location: selectedLocation,
            educational_level: selectedLevel,
            educational_system: selectedSystem,
        });
    };

    const addToCompare = (school) => {
        try {
            const stored = JSON.parse(
                localStorage.getItem('rukys_compare_schools') || 
                localStorage.getItem('eduselect_compare_schools') || 
                '[]'
            );
            if (stored.some((s) => s.id === school.id)) {
                setCompareToast(`"${school.name}" is already in your comparison list.`);
                setTimeout(() => setCompareToast(null), 3000);
                return;
            }
            if (stored.length >= 3) {
                setCompareToast('You can compare a maximum of 3 schools at once.');
                setTimeout(() => setCompareToast(null), 3000);
                return;
            }
            const updated = [...stored, {
                id: school.id,
                name: school.name,
                featured_image: school.featured_image || school.image_url,
                location: school.location,
            }];
            localStorage.setItem('rukys_compare_schools', JSON.stringify(updated));
            localStorage.setItem('eduselect_compare_schools', JSON.stringify(updated));
            window.dispatchEvent(new Event('eduselect_compare_updated'));
            window.dispatchEvent(new Event('rukys_compare_updated'));
            setCompareToast(`Added "${school.name}" to comparison.`);
            setTimeout(() => setCompareToast(null), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    // Filtered schools for tabs
    const filteredSchools = featuredSchools.filter((school) => {
        if (schoolCategoryTab === 'kano') {
            return (school.location || '').toLowerCase().includes('kano');
        }
        if (schoolCategoryTab === 'lagos') {
            return (school.location || '').toLowerCase().includes('lagos');
        }
        if (schoolCategoryTab === 'british') {
            return (school.educational_system || '').toLowerCase().includes('british') ||
                   (school.curriculum || '').toLowerCase().includes('british');
        }
        if (schoolCategoryTab === 'boarding') {
            return (school.residential_status || '').toLowerCase().includes('boarding');
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-[#FAFBFD] text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
            <Head title="Kindred Path — Premier School Directory & Comparison Platform in Nigeria" />
            <Navbar />

            {/* Notification Toast for Compare */}
            {compareToast && (
                <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>{compareToast}</span>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════
                HERO SECTION — Bespoke Modern Luxury Design
            ═══════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-slate-950 pt-16 pb-24 lg:pt-24 lg:pb-32 text-white">
                {/* Modern subtle ambient gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

                {/* Delicate architectural mesh overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                        backgroundSize: '36px 36px'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    {/* Trust Indicator Pill */}
                    <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-lg backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Nigeria's Premier Educational Discovery Hub</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-amber-300 font-medium">Kano & Nationwide</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className={`transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white max-w-5xl mx-auto leading-[1.12] tracking-tight">
                            Discover Exceptional Schools for{' '}
                            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                                Your Child's Future
                            </span>
                        </h1>
                    </div>

                    {/* Subheadline */}
                    <div className={`transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                            Explore vetted nursery, primary, and secondary institutions in Kano, Lagos, Abuja, and beyond. Compare transparent tuition, curricula, and verified community reviews.
                        </p>
                    </div>

                    {/* Quick Hub Navigation Pills */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedLocation('')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedLocation === ''
                                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            All Regions
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedLocation('Kano')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedLocation === 'Kano'
                                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            📍 Kano State
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedLocation('Lagos')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedLocation === 'Lagos'
                                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            📍 Lagos State
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedSystem('British')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedSystem === 'British'
                                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            🇬🇧 British Curriculum
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedLevel('Secondary')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedLevel === 'Secondary'
                                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                        >
                            🎓 Secondary Colleges
                        </button>
                    </div>

                    {/* Integrated Horizontal Command Search Bar */}
                    <div className={`mt-8 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'}`}>
                        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] border border-white/80 text-slate-900 text-left">

                            {/* Location Detection Banner */}
                            {!locationBannerDismissed && userLocation.status === 'resolved' && userLocation.city && (
                                <div className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 animate-in fade-in">
                                    <div className="flex items-center gap-2.5 text-xs text-emerald-900">
                                        <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>
                                            <span className="font-bold">Detected City: {userLocation.city}</span>
                                            {userLocation.matched && (
                                                <span className="text-emerald-700 ml-1">— Pre-filled local schools for you.</span>
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setLocationBannerDismissed(true)}
                                        className="text-slate-400 hover:text-slate-700 p-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSearchSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {/* Keyword */}
                                    <div className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <Search className="w-3.5 h-3.5 text-emerald-600" />
                                            School Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Bayero, Green Valley..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                            City or State
                                        </label>
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer"
                                        >
                                            <option value="">All Nigerian Locations</option>
                                            {availableLocations.map((loc) => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Level */}
                                    <div className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                                            Academic Level
                                        </label>
                                        <select
                                            value={selectedLevel}
                                            onChange={(e) => setSelectedLevel(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer"
                                        >
                                            <option value="">All Academic Levels</option>
                                            <option value="Nursery">Nursery & Early Years</option>
                                            <option value="Primary">Primary Elementary</option>
                                            <option value="Secondary">Secondary & High School</option>
                                            <option value="K-12">Full K-12 (All Grades)</option>
                                        </select>
                                    </div>

                                    {/* Curriculum */}
                                    <div className="bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                                            Curriculum
                                        </label>
                                        <select
                                            value={selectedSystem}
                                            onChange={(e) => setSelectedSystem(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-slate-900 focus:ring-0 cursor-pointer"
                                        >
                                            <option value="">All Curricula</option>
                                            <option value="British">British & Cambridge</option>
                                            <option value="National">Nigerian National (WAEC)</option>
                                            <option value="Montessori">Montessori</option>
                                            <option value="American">American System</option>
                                            <option value="IB">International Baccalaureate</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>Covering accredited institutions across Kano, Lagos, and Abuja</span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Link
                                            href={route('schools.index')}
                                            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5"
                                        >
                                            <SlidersHorizontal className="w-3.5 h-3.5" />
                                            <span>Detailed Filters</span>
                                        </Link>
                                        <button
                                            type="submit"
                                            className="flex-1 sm:flex-none px-7 py-3 bg-slate-950 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-emerald-950/20 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Search className="w-4 h-4" />
                                            <span>Explore Schools</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                PLATFORM TRUST METRICS STRIP
            ═══════════════════════════════════════════════════ */}
            <section className="bg-white border-b border-slate-200/80 py-8 relative z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                value: <StatCounter end={stats.totalSchools || 8} suffix="+" />,
                                label: 'Verified Institutions',
                                sub: 'Strictly audited data',
                                icon: <Building2 className="w-5 h-5 text-emerald-600" />,
                            },
                            {
                                value: <StatCounter end={stats.locationsCount || 14} suffix=" Hubs" />,
                                label: 'Covered Locations',
                                sub: 'Kano, Lagos, Kaduna & FCT',
                                icon: <MapPin className="w-5 h-5 text-amber-500" />,
                            },
                            {
                                value: '100%',
                                label: 'Fee Transparency',
                                sub: 'Termly breakdowns verified',
                                icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                            },
                            {
                                value: '3-Way',
                                label: 'Decision Matrix',
                                sub: 'Side-by-side comparison',
                                icon: <Scale className="w-5 h-5 text-indigo-600" />,
                            },
                        ].map(({ value, label, sub, icon }, i) => (
                            <div key={label} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0">
                                    {icon}
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                                        {value}
                                    </div>
                                    <div className="text-xs font-bold text-slate-700">{label}</div>
                                    <div className="text-[11px] text-slate-400 font-medium">{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                FEATURED SCHOOLS DIRECTORY — High-Aesthetic Cards
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 lg:py-24 bg-[#FAFBFD]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span>Curated Educational Profiles</span>
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Featured Nigerian Schools
                            </h2>
                            <p className="text-sm text-slate-600 mt-2 max-w-xl">
                                Hand-picked institutions recognized for rigorous academic performance, modern infrastructure, and positive parent endorsements.
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { id: 'all', label: 'All Featured' },
                                { id: 'kano', label: 'Kano Hub' },
                                { id: 'lagos', label: 'Lagos Hub' },
                                { id: 'british', label: 'British System' },
                                { id: 'boarding', label: 'Boarding' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSchoolCategoryTab(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        schoolCategoryTab === tab.id
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                            <Link
                                href={route('schools.index')}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all flex items-center gap-1 ml-1"
                            >
                                <span>All Directory</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSchools.length === 0 ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4 animate-pulse">
                                    <div className="h-48 bg-slate-200 rounded-2xl" />
                                    <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                                    <div className="h-4 bg-slate-200 rounded-lg w-full" />
                                    <div className="h-10 bg-slate-200 rounded-xl" />
                                </div>
                            ))
                        ) : (
                            filteredSchools.map((school, i) => {
                                const admissionStatus = school.admission_status || 'Open';
                                const admissionStyle = admissionStatus === 'Open'
                                    ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                                    : admissionStatus === 'In Progress'
                                    ? 'bg-amber-500/90 text-white border-amber-400/50'
                                    : 'bg-slate-800/90 text-slate-300 border-slate-700';

                                const feesDisplay = school.fees 
                                    ? `₦${Number(school.fees).toLocaleString()}`
                                    : 'Contact School';

                                return (
                                    <div 
                                        key={school.id}
                                        className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                                    >
                                        {/* Card Image Banner */}
                                        <div className="relative h-56 w-full overflow-hidden bg-slate-100 shrink-0">
                                            <img
                                                src={getSchoolImage(school, i)}
                                                alt={school.name}
                                                onError={(e) => handleImageError(e, i)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Gradient dark fade at bottom */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                                            {/* Top badges */}
                                            <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                                                <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-sm border border-slate-700/60">
                                                    {school.educational_system || 'National'}
                                                </span>
                                                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
                                                    {school.educational_level || 'K-12'}
                                                </span>
                                            </div>

                                            {/* Admission status */}
                                            <div className="absolute top-3.5 right-3.5 z-10">
                                                <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg border backdrop-blur-md shadow-sm ${admissionStyle}`}>
                                                    {admissionStatus}
                                                </span>
                                            </div>

                                            {/* Bottom bar inside image */}
                                            <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                    <span className="truncate">{school.location}</span>
                                                </div>
                                                <RatingStars rating={school.rating_cache || 5.0} count={school.review_count_cache || 1} size="sm" />
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <Link href={route('schools.show', school.slug || school.id)}>
                                                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                                                        {school.name}
                                                    </h3>
                                                </Link>

                                                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {school.description || 'Dedicated academic institution offering modern holistic curriculum and enriched extracurricular development.'}
                                                </p>

                                                {/* Characteristic Pills */}
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                                                        {school.residential_status || 'Day & Boarding'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                                                        {school.ownership || 'Private'}
                                                    </span>
                                                    {school.facilities_cache && (
                                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                            {school.facilities_cache}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Footer with Tuition & Action */}
                                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tuition / Term</div>
                                                    <div className="text-base font-extrabold text-slate-900">
                                                        {feesDisplay}
                                                        <span className="text-[11px] font-normal text-slate-400 ml-1">/ term</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => addToCompare(school)}
                                                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 border border-slate-200 text-slate-600 hover:text-amber-800 transition-all"
                                                        title="Add to Compare Tray"
                                                    >
                                                        <Scale className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href={route('schools.show', school.slug || school.id)}
                                                        className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                                                    >
                                                        <span>View Details</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                WHY KINDRED PATH — BENTO COMPARISON & VALUE PROP
            ═══════════════════════════════════════════════════ */}
            <section className="py-20 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Transparent Educational Guidance</span>
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Why Nigerian Families Choose Kindred Path
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                            Rather than relying on unverified rumors or outdated brochures, Kindred Path gives you transparent data, verified school records, and direct parent community insights.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Scale className="w-6 h-6 text-emerald-600" />,
                                badge: 'Decision Matrix',
                                title: 'Side-by-Side Comparison',
                                desc: 'Select any 3 schools simultaneously to evaluate fees, student-teacher ratios, Cambridge accreditation, and boarding amenities side-by-side.',
                                bg: 'bg-emerald-50/60 border-emerald-100',
                            },
                            {
                                icon: <Users className="w-6 h-6 text-amber-500" />,
                                badge: 'Authentic Voices',
                                title: 'Verified Parent Reviews',
                                desc: 'Read audited feedback from parents whose children attend the institutions. Zero spam, transparent feedback on teachers and campus culture.',
                                bg: 'bg-amber-50/60 border-amber-100',
                            },
                            {
                                icon: <Compass className="w-6 h-6 text-teal-600" />,
                                badge: 'Commute Smart',
                                title: 'Location Radius Matching',
                                desc: 'Find accredited schools within a comfortable commute radius from your home or office in Kano, Lagos, or Abuja using integrated GPS mapping.',
                                bg: 'bg-teal-50/60 border-teal-100',
                            },
                        ].map((card) => (
                            <div 
                                key={card.title}
                                className={`rounded-3xl border ${card.bg} p-8 hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-6">
                                        {card.icon}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        {card.badge}
                                    </span>
                                    <h3 className="font-display text-xl font-bold text-slate-900 mt-2 mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust badges grid */}
                    <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-950 text-white flex flex-wrap items-center justify-around gap-6">
                        {[
                            'Ministry Verified Listings',
                            'Transparent Termly Fees',
                            'Boarding & Day Verification',
                            'Direct Campus Tour Booking',
                            'Curriculum & WAEC Records',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                AUTHENTIC NIGERIAN PARENT TESTIMONIALS
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-[#FAFBFD]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Real Community Experiences
                        </p>
                        <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-2">
                            Endorsed by Parents Across Nigeria
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: "Finding a secondary school in Kano that balances both British curriculum and strong moral education used to be so stressful. Kindred Path made comparing Bayero Royal Academy and others effortless.",
                                name: "Alhaji Musa Dantata",
                                role: "Parent, Kano Municipal",
                                initial: "MD",
                            },
                            {
                                quote: "The transparent fee breakdown alone saved us weeks of calling bursary offices. We booked a physical campus tour directly through the portal and finalized admission smoothly.",
                                name: "Dr. Michael Adeyemi",
                                role: "Parent, Lekki Phase 1, Lagos",
                                initial: "MA",
                            },
                            {
                                quote: "Having authentic parent reviews from families whose children actually attend gave us real peace of mind. Truly a game changer for Nigerian education.",
                                name: "Hajiya Aisha Gwandu",
                                role: "Parent, Nasarawa GRA, Kano",
                                initial: "AG",
                            },
                        ].map((test) => (
                            <div key={test.name} className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1 mb-4">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                                        "{test.quote}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-bold text-xs flex items-center justify-center">
                                        {test.initial}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{test.name}</div>
                                        <div className="text-xs text-slate-500">{test.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SCHOOL PROPRIETOR CALL TO ACTION
            ═══════════════════════════════════════════════════ */}
            <section className="py-16 bg-white border-t border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl bg-slate-950 p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-slate-800">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-2xl text-left space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>For School Proprietors & Principals</span>
                                </div>
                                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    Showcase Your Institution on Kindred Path
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Publish your official curriculum, manage admission intake seasons, receive direct campus tour bookings, and connect with thousands of discerning Nigerian families.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                                <Link
                                    href={route('register')}
                                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md text-center hover:scale-[1.02]"
                                >
                                    Claim / Register School
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold rounded-xl text-sm transition-all text-center"
                                >
                                    Admin Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <CompareFloatingBar />
        </div>
    );
}
