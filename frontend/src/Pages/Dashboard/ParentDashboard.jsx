import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import CompareFloatingBar from '@/Components/CompareFloatingBar';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';
import { 
    Calendar, CheckCircle2, Clock, MapPin, Search, Scale, 
    BookOpen, Star, AlertCircle, ArrowRight, Trash2, Heart
} from 'lucide-react';

export default function ParentDashboard({ tourRequests = [], reviews = [], recommendedSchools = [] }) {
    const { auth, flash = {} } = usePage().props;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
            <Head title="Parent Dashboard | My Educational Inquiries" />
            <Navbar />

            {/* Flash messages */}
            {flash.success && (
                <div className="bg-emerald-600/90 text-white px-4 py-3 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="bg-rose-600/90 text-white px-4 py-3 text-center text-xs font-semibold shadow-md flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/40 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                                <span>Parent & Guardian Workspace</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Welcome back, {auth.user.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Monitor your campus tour appointments, track submitted school reviews, and explore curated educational recommendations.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route('schools.index')}
                                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span>Search Schools</span>
                            </Link>
                            <Link
                                href={route('schools.compare')}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                                <Scale className="w-3.5 h-3.5 text-amber-400" />
                                <span>Compare Tray</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
                {/* 1. Campus Tour Requests Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-rose-500" />
                                <span>My Scheduled Campus Tours</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Real-time status of your physical or virtual visits requested with school admissions.
                            </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                            {tourRequests.length} {tourRequests.length === 1 ? 'Request' : 'Requests'}
                        </span>
                    </div>

                    {tourRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tourRequests.map((tour) => (
                                <div
                                    key={tour.id}
                                    className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {tour.school && (
                                                <img
                                                    src={getSchoolImage(tour.school)}
                                                    onError={(event) => handleImageError(event, tour.school.id || 0)}
                                                    alt={tour.school.name}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                />
                                            )}
                                            <div>
                                                <Link
                                                    href={route('schools.show', tour.school.slug)}
                                                    className="text-sm font-bold text-white hover:text-rose-400 transition-colors line-clamp-1"
                                                >
                                                    {tour.school?.name}
                                                </Link>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 text-rose-400" />
                                                    <span>{tour.school?.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            tour.status === 'confirmed'
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : tour.status === 'completed'
                                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                : tour.status === 'cancelled'
                                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        }`}>
                                            {tour.status}
                                        </span>
                                    </div>

                                    <div className="bg-slate-900/60 rounded-xl p-3 text-xs space-y-1.5 text-slate-300">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Date & Slot:</span>
                                            <span className="font-semibold text-white">{tour.preferred_date} • {tour.time_slot}</span>
                                        </div>
                                        {tour.student_name && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Student:</span>
                                                <span className="text-slate-200">{tour.student_name} ({tour.student_grade || 'Prospective'})</span>
                                            </div>
                                        )}
                                        {tour.notes && (
                                            <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 italic">
                                                "{tour.notes}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400">
                            You haven't requested any school tours yet. Visit any school's profile to book an in-person or virtual tour.
                        </div>
                    )}
                </div>

                {/* 2. My Submitted Reviews Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400" />
                                <span>My Published Reviews & Feedback</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Verified experiences you have contributed to guide fellow parents.
                            </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                        </span>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={route('schools.show', rev.school.slug)}
                                            className="text-sm font-bold text-white hover:text-rose-400 transition-colors"
                                        >
                                            {rev.school?.name}
                                        </Link>

                                        <div className="flex items-center gap-3">
                                            <RatingStars rating={rev.rating} size="sm" />
                                            <Link
                                                href={route('reviews.destroy', rev.id)}
                                                method="delete"
                                                as="button"
                                                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                                title="Delete this review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                        "{rev.comment}"
                                    </p>

                                    <div className="text-[10px] text-slate-500">
                                        Submitted on {new Date(rev.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400">
                            You have not submitted any reviews yet. Share your feedback on schools your children attend to help other parents!
                        </div>
                    )}
                </div>

                {/* 3. Recommended Top-Tier Schools */}
                {recommendedSchools.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500" />
                                <span>Recommended Top-Tier Institutions</span>
                            </h2>
                            <Link href={route('schools.index')} className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                                <span>Explore Directory</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recommendedSchools.map((sch) => (
                                <div key={sch.id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden p-4 space-y-3">
                                    <img
                                        src={getSchoolImage(sch)}
                                        onError={(event) => handleImageError(event, sch.id || 0)}
                                        alt={sch.name}
                                        className="w-full h-28 rounded-xl object-cover"
                                    />
                                    <div>
                                        <Link href={route('schools.show', sch.slug)} className="text-xs font-bold text-white hover:text-rose-400 line-clamp-1">
                                            {sch.name}
                                        </Link>
                                        <div className="text-[10px] text-slate-400">{sch.location}</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                                        <span className="text-xs font-bold text-white">₦{Number(sch.fees).toLocaleString()}</span>
                                        <RatingStars rating={sch.rating_cache} size="sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
            <CompareFloatingBar />
        </div>
    );
}
