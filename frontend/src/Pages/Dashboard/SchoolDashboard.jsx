import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import { 
    Building2, CheckCircle2, Clock, AlertCircle, Calendar, 
    MessageSquare, Edit3, Globe, Phone, Mail, MapPin, 
    Eye, ShieldCheck, XCircle, ArrowRight
} from 'lucide-react';

export default function SchoolDashboard({ school = null, tourRequests = [], reviews = [] }) {
    const { auth, flash = {} } = usePage().props;

    const updateTourStatus = (tourId, newStatus) => {
        router.patch(route('tours.updateStatus', tourId), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
            <Head title="School Administrator Portal | Profile & Inquiries" />
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
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                                <Building2 className="w-4 h-4" />
                                <span>School Administration Workspace</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {school ? school.name : 'Register Your Institution'}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Manage your official curriculum specifications, respond to incoming parent campus visits, and review public ratings.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route('school-profile.edit')}
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>{school ? 'Edit School Profile' : 'Create School Profile'}</span>
                            </Link>

                            {school && (
                                <Link
                                    href={route('schools.show', school.slug)}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Public Listing</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
                {/* If no school profile exists yet */}
                {!school ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Your School Profile is Not Yet Set Up</h3>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                            Set up your school's official presence to showcase tuition fees, curriculum, boarding facilities, and receive direct parent tour inquiries.
                        </p>
                        <Link
                            href={route('school-profile.edit')}
                            className="inline-block px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                        >
                            Set Up School Profile Now
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Listing Status & Metrics Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Verification Status Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Listing Verification
                                </div>
                                <div className="flex items-center gap-2">
                                    {school.listing?.status === 'approved' ? (
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                                            <ShieldCheck className="w-5 h-5" />
                                            <span>Approved & Public</span>
                                        </div>
                                    ) : school.listing?.status === 'rejected' ? (
                                        <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                                            <XCircle className="w-5 h-5" />
                                            <span>Rejected</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                                            <Clock className="w-5 h-5" />
                                            <span>Under Admin Review</span>
                                        </div>
                                    )}
                                </div>
                                {school.listing?.rejection_reason && (
                                    <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40 mt-1">
                                        Reason: {school.listing.rejection_reason}
                                    </div>
                                )}
                            </div>

                            {/* Average Rating */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Community Rating
                                </div>
                                <div className="text-2xl font-extrabold text-white flex items-center gap-2">
                                    <span>{Number(school.rating_cache).toFixed(1)}</span>
                                    <RatingStars rating={school.rating_cache} size="sm" />
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    From {school.review_count_cache} parent reviews
                                </div>
                            </div>

                            {/* Tour Requests Count */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Campus Inquiries
                                </div>
                                <div className="text-2xl font-extrabold text-white">
                                    {tourRequests.length}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    {tourRequests.filter((t) => t.status === 'pending').length} pending actions
                                </div>
                            </div>

                            {/* Admission Status */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Intake Status
                                </div>
                                <div className="text-2xl font-extrabold text-emerald-400">
                                    {school.admission_status}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    Tuition: ₦{Number(school.fees).toLocaleString()} / term
                                </div>
                            </div>
                        </div>

                        {/* Incoming Tour Requests Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-rose-500" />
                                        <span>Incoming Campus Tour Bookings</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Respond to parent visitation requests and manage admissions appointments.
                                    </p>
                                </div>
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                                    {tourRequests.length} Total
                                </span>
                            </div>

                            {tourRequests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] bg-slate-950/40">
                                                <th className="py-3 px-4">Parent Information</th>
                                                <th className="py-3 px-4">Scheduled Date & Slot</th>
                                                <th className="py-3 px-4">Student & Grade</th>
                                                <th className="py-3 px-4">Notes</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/80">
                                            {tourRequests.map((tour) => (
                                                <tr key={tour.id} className="hover:bg-slate-850/50">
                                                    <td className="py-4 px-4">
                                                        <div className="font-bold text-white">{tour.user?.name || 'Prospective Parent'}</div>
                                                        <div className="text-[11px] text-slate-400">{tour.user?.email}</div>
                                                        {tour.user?.phone && (
                                                            <div className="text-[10px] text-slate-500 font-mono">{tour.user.phone}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-slate-200">
                                                        <div>{tour.preferred_date}</div>
                                                        <div className="text-[11px] text-slate-400">{tour.time_slot}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-medium text-white">{tour.student_name || '—'}</div>
                                                        <div className="text-[11px] text-slate-400">{tour.student_grade || 'Grade Unspecified'}</div>
                                                    </td>
                                                    <td className="py-4 px-4 max-w-xs truncate text-slate-400">
                                                        {tour.notes || 'No special requests'}
                                                    </td>
                                                    <td className="py-4 px-4">
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
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {tour.status !== 'confirmed' && (
                                                                <button
                                                                    onClick={() => updateTourStatus(tour.id, 'confirmed')}
                                                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                                                >
                                                                    Confirm
                                                                </button>
                                                            )}
                                                            {tour.status !== 'completed' && (
                                                                <button
                                                                    onClick={() => updateTourStatus(tour.id, 'completed')}
                                                                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                                                >
                                                                    Complete
                                                                </button>
                                                            )}
                                                            {tour.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => updateTourStatus(tour.id, 'cancelled')}
                                                                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-xs text-slate-400">
                                    No campus tour requests submitted yet.
                                </div>
                            )}
                        </div>

                        {/* Public Reviews Received Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-amber-400" />
                                        <span>Parent Reviews Received</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Empirical community feedback posted by registered parents.
                                    </p>
                                </div>
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                                    {reviews.length} Reviews
                                </span>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-white text-xs">
                                                    {rev.user?.name || 'Parent'}
                                                </div>
                                                <RatingStars rating={rev.rating} size="sm" />
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                "{rev.comment}"
                                            </p>
                                            <div className="text-[10px] text-slate-500">
                                                {new Date(rev.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-xs text-slate-400">
                                    No reviews submitted yet for your school.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
