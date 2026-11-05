import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';
import { 
    ShieldCheck, CheckCircle2, Clock, XCircle, Users, Building2, 
    MessageSquare, Calendar, AlertCircle, Eye, Trash2, Check, X,
    ArrowRight, UserCheck, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard({
    stats = {},
    pendingListings = [],
    allListings = { data: [] },
    allUsers = { data: [] },
    recentReviews = []
}) {
    const { auth, flash = {} } = usePage().props;
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // pending, listings, users, reviews

    // Approve listing
    const handleApprove = (listingId) => {
        router.post(route('admin.listings.approve', listingId), {}, {
            preserveScroll: true,
        });
    };

    // Open reject modal
    const openRejectModal = (listing) => {
        setSelectedListing(listing);
        setRejectionReason('');
        setRejectModalOpen(true);
    };

    // Submit rejection
    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!selectedListing) return;
        router.post(route('admin.listings.reject', selectedListing.id), {
            reason: rejectionReason,
        }, {
            preserveScroll: true,
            onSuccess: () => setRejectModalOpen(false),
        });
    };

    // Update user role
    const handleRoleChange = (userId, newRole) => {
        router.patch(route('admin.users.updateRole', userId), { role: newRole }, {
            preserveScroll: true,
        });
    };

    // Delete review
    const handleDeleteReview = (reviewId) => {
        if (confirm('Are you sure you want to permanently delete this parent review?')) {
            router.delete(route('admin.reviews.destroy', reviewId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
            <Head title="System Administrator Portal | Quality Control & Oversight" />
            <Navbar />

            {/* Flash Messages */}
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
                                <ShieldCheck className="w-4 h-4" />
                                <span>Ministry & Platform Oversight Desk</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                System Administration Console
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Audit school legitimacy, moderate community reviews, verify institutional criteria, and oversee user roles.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                                Admin: {auth.user.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
                {/* 1. Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Total Institutions</div>
                        <div className="text-3xl font-extrabold text-white">{stats.total_schools || 0}</div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                            {stats.approved_listings || 0} approved public listings
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Pending Verification</div>
                        <div className="text-3xl font-extrabold text-amber-400">{stats.pending_listings || 0}</div>
                        <div className="text-[11px] text-slate-400">
                            Awaiting documentation review
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Platform Users</div>
                        <div className="text-3xl font-extrabold text-white">
                            {(stats.total_parents || 0) + (stats.total_schools_reps || 0)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                            {stats.total_parents || 0} parents • {stats.total_schools_reps || 0} school reps
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Community Engagement</div>
                        <div className="text-3xl font-extrabold text-rose-400">{stats.total_reviews || 0}</div>
                        <div className="text-[11px] text-slate-400">
                            {stats.total_tours || 0} campus tours booked
                        </div>
                    </div>
                </div>

                {/* 2. Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'pending'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>Pending Approvals ({pendingListings.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'listings'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        <span>All School Listings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'users'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>User Role Management</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'reviews'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Review Moderation</span>
                    </button>
                </div>

                {/* Tab 1: Pending Approvals Queue */}
                {activeTab === 'pending' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    <span>School Listing Approval Queue</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Verify that submitted schools meet educational standards before making them publicly searchable.
                                </p>
                            </div>
                        </div>

                        {pendingListings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[750px]">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] bg-slate-950/40">
                                            <th className="py-3 px-4">School Details</th>
                                            <th className="py-3 px-4">Curriculum & Level</th>
                                            <th className="py-3 px-4">Tuition Fees</th>
                                            <th className="py-3 px-4">Submitted By</th>
                                            <th className="py-3 px-4 text-right">Verification Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80">
                                        {pendingListings.map((listing) => (
                                            <tr key={listing.id} className="hover:bg-slate-850/50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getSchoolImage(listing.school)}
                                                            onError={(event) => handleImageError(event, listing.school?.id || 0)}
                                                            alt={listing.school?.name}
                                                            className="w-10 h-10 rounded-xl object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-white text-sm">
                                                                {listing.school?.name}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400">
                                                                {listing.school?.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-rose-300">
                                                        {listing.school?.educational_system}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {listing.school?.educational_level} • {listing.school?.residential_status}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-bold text-white">
                                                    ₦{Number(listing.school?.fees).toLocaleString()} / term
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-slate-200">
                                                        {listing.school?.user?.name || 'School Administrator'}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400">
                                                        {listing.school?.user?.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApprove(listing.id)}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            <span>Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(listing)}
                                                            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-xs text-slate-400 space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                                <div className="text-sm font-bold text-white">Verification Queue is Clear</div>
                                <p>All submitted school listings have been reviewed and processed.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: All School Listings */}
                {activeTab === 'listings' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-rose-500" />
                                    <span>All Registered Educational Institutions</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Comprehensive catalog of approved, pending, and rejected school profiles.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] bg-slate-950/40">
                                        <th className="py-3 px-4">School</th>
                                        <th className="py-3 px-4">Curriculum</th>
                                        <th className="py-3 px-4">Tuition</th>
                                        <th className="py-3 px-4">Verification Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80">
                                    {allListings.data && allListings.data.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-slate-850/50">
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-white">{listing.school?.name}</div>
                                                <div className="text-[11px] text-slate-400">{listing.school?.location}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {listing.school?.educational_system} • {listing.school?.educational_level}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-white">
                                                ₦{Number(listing.school?.fees).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    listing.status === 'approved'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : listing.status === 'rejected'
                                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                    {listing.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('schools.show', listing.school?.slug || '')}
                                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 3: User Role Management */}
                {activeTab === 'users' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-rose-500" />
                                    <span>Account & Privilege Administration</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Promote or assign roles to registered accounts (Parent, School Representative, or System Administrator).
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px] bg-slate-950/40">
                                        <th className="py-3 px-4">User Name</th>
                                        <th className="py-3 px-4">Email Address</th>
                                        <th className="py-3 px-4">Contact Phone</th>
                                        <th className="py-3 px-4">Assigned Role</th>
                                        <th className="py-3 px-4 text-right">Role Modifier</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80">
                                    {allUsers.data && allUsers.data.map((usr) => (
                                        <tr key={usr.id} className="hover:bg-slate-850/50">
                                            <td className="py-3.5 px-4 font-bold text-white">
                                                {usr.name}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-slate-400">
                                                {usr.email}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-300">
                                                {usr.phone || '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    usr.role === 'admin'
                                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                        : usr.role === 'school'
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                }`}>
                                                    {usr.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <select
                                                    value={usr.role}
                                                    onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                                                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                                                >
                                                    <option value="parent">Parent</option>
                                                    <option value="school">School Rep</option>
                                                    <option value="admin">Administrator</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 4: Review Moderation */}
                {activeTab === 'reviews' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-amber-400" />
                                    <span>Community Review Moderation</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Remove abusive, fraudulent, or unconstructive feedback to preserve data integrity.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentReviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-xs">{rev.user?.name}</span>
                                            <span className="text-slate-500 text-[10px]">reviewed</span>
                                            <span className="font-semibold text-rose-300 text-xs">{rev.school?.name}</span>
                                            <RatingStars rating={rev.rating} size="sm" />
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed italic">
                                            "{rev.comment}"
                                        </p>
                                        <div className="text-[10px] text-slate-500">
                                            Posted on {new Date(rev.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteReview(rev.id)}
                                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete Review</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Rejection Reason Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-rose-500" />
                                <span>Reject School Listing</span>
                            </h3>
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-400">
                            Please explain why the listing for <strong className="text-white">{selectedListing?.school?.name}</strong> is being rejected. This feedback will be displayed to the school representative.
                        </p>

                        <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
                            <textarea
                                rows={4}
                                required
                                placeholder="e.g. Incomplete curriculum documentation, invalid contact phone number, or unverified accreditation..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(false)}
                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
