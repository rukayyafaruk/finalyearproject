import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { schoolsApi } from '@/api/client';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import CompareFloatingBar from '@/Components/CompareFloatingBar';
import {
    MapPin, Scale, Calendar, Clock, User, Phone, Mail, Globe,
    ShieldCheck, GraduationCap, BookOpen, Home, CheckCircle2,
    AlertCircle, MessageSquare, Send, ArrowLeft, ArrowRight,
    Star, Trash2, CalendarCheck, Loader2
} from 'lucide-react';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';

export default function Show(props) {
    const [pageData, setPageData] = useState({
        school: props.school || null,
        userReview: props.userReview || null,
        userTourRequest: props.userTourRequest || null,
        similarSchools: props.similarSchools || [],
    });
    const [loading, setLoading] = useState(!props.school);

    useEffect(() => {
        if (!props.school) {
            const slug = window.location.pathname.split('/').filter(Boolean).pop();
            if (slug) {
                schoolsApi.getSchool(slug)
                    .then((res) => {
                        if (res.data) {
                            setPageData({
                                school: res.data.school,
                                userReview: res.data.userReview,
                                userTourRequest: res.data.userTourRequest || null,
                                similarSchools: res.data.relatedSchools || res.data.similarSchools || [],
                            });
                        }
                    })
                    .catch(console.error)
                    .finally(() => setLoading(false));
            }
        }
    }, [props.school]);

    const { school, userReview, userTourRequest, similarSchools } = pageData;
    const { auth, flash = {} } = usePage().props;
    const [tourModalOpen, setTourModalOpen] = useState(false);

    // Review Form State (Algorithm 4)
    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: reviewProcessing,
        reset: resetReview,
        errors: reviewErrors
    } = useForm({
        rating: 5,
        comment: '',
    });

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        postReview(route('reviews.store', school.id), {
            preserveScroll: true,
            onSuccess: () => resetReview('comment'),
        });
    };

    // Campus Tour Booking Form State
    const {
        data: tourData,
        setData: setTourData,
        post: postTour,
        processing: tourProcessing,
        reset: resetTour,
        errors: tourErrors,
    } = useForm({
        preferred_date: '',
        time_slot: 'Morning (10:00 AM - 12:00 PM)',
        student_name: '',
        student_grade: '',
        notes: '',
    });

    if (loading || !school) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
                <p className="text-sm">Loading school profile details...</p>
            </div>
        );
    }

    const handleTourSubmit = (e) => {
        e.preventDefault();
        postTour(route('tours.store', school.id), {
            preserveScroll: true,
            onSuccess: () => {
                setTourModalOpen(false);
                resetTour();
            },
        });
    };

    // Compare helper
    const addToCompare = () => {
        try {
            const stored = JSON.parse(localStorage.getItem('eduselect_compare_schools') || '[]');
            if (stored.some((s) => s.id === school.id)) {
                alert('This school is already in your comparison tray.');
                return;
            }
            if (stored.length >= 3) {
                alert('You can compare a maximum of 3 schools. Please remove one from the comparison tray.');
                return;
            }
            const updated = [...stored, {
                id: school.id,
                name: school.name,
                featured_image: school.featured_image,
                location: school.location,
            }];
            localStorage.setItem('eduselect_compare_schools', JSON.stringify(updated));
            window.dispatchEvent(new Event('eduselect_compare_updated'));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
            <Head title={`${school.name} | School Profile & Admissions`} />
            <Navbar />

            {/* Notification Alerts */}
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

            {/* Breadcrumb Navigation */}
            <div className="border-b border-slate-800 bg-slate-900/60 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <Link href={route('schools.index')} className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Directory</span>
                        </Link>
                        <span>/</span>
                        <span className="text-slate-200 font-medium truncate max-w-xs">{school.name}</span>
                    </div>

                    <button
                        onClick={addToCompare}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Add to Compare</span>
                    </button>
                </div>
            </div>

            {/* School Hero Banner */}
            <div className="relative bg-slate-900 border-b border-slate-800">
                <div className="h-64 sm:h-80 lg:h-96 w-full overflow-hidden relative">
                    <img
                        src={getSchoolImage(school)}
                        onError={(event) => handleImageError(event, school.id || 0)}
                        alt={school.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                                    {school.educational_system} Curriculum
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                                    {school.educational_level}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                                    {school.residential_status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${school.admission_status === 'Open'
                                    ? 'bg-emerald-600 text-white'
                                    : school.admission_status === 'In Progress'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    Admissions {school.admission_status}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                {school.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{school.location} ({school.address || 'Central District'})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <RatingStars rating={school.rating_cache} count={school.review_count_cache} size="md" />
                                </div>
                            </div>
                        </div>

                        {/* CTA Action Box */}
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center gap-4 shrink-0">
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tuition Fee</div>
                                <div className="text-2xl font-extrabold text-white">
                                    ₦{Number(school.fees).toLocaleString()}{' '}
                                    <span className="text-xs font-normal text-slate-400">/ term</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setTourModalOpen(true)}
                                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Book Campus Tour</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Tour Notification Banner if User already booked */}
            {userTourRequest && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
                    <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>You have a booked Campus Tour</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500 text-slate-950">
                                        {userTourRequest.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Scheduled for {userTourRequest.preferred_date} • {userTourRequest.time_slot}
                                    {userTourRequest.student_name ? ` for ${userTourRequest.student_name}` : ''}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('dashboard')}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        >
                            View in Dashboard
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Details Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Description, Specs Grid, Reviews */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-rose-500" />
                                <span>Academic Profile & Philosophy</span>
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {school.description ||
                                    `${school.name} is a premier educational institution committed to fostering intellectual excellence, moral integrity, and modern co-curricular skills. Equipped with state-of-the-art laboratory facilities, digital classrooms, and seasoned educational practitioners, we ensure each student receives personalized guidance.`}
                            </p>
                        </div>

                        {/* Empirical Attributes Matrix */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
                            <h3 className="text-lg font-bold text-white tracking-tight mb-6">
                                Institutional Specifications
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Curriculum Model</div>
                                    <div className="font-bold text-white text-sm">{school.educational_system}</div>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Educational Level</div>
                                    <div className="font-bold text-white text-sm">{school.educational_level}</div>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Residential Provision</div>
                                    <div className="font-bold text-white text-sm">{school.residential_status}</div>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Ownership Structure</div>
                                    <div className="font-bold text-white text-sm">{school.ownership}</div>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Admission Intake</div>
                                    <div className="font-bold text-emerald-400 text-sm">{school.admission_status}</div>
                                </div>
                                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1">
                                    <div className="text-slate-400">Verified Listing</div>
                                    <div className="font-bold text-rose-400 text-sm flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Official Record</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews & Ratings Section (Objective 3) */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-amber-400" />
                                        <span>Parent & Community Reviews</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Authentic reviews submitted by verified parents and guardians.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-extrabold text-amber-400">
                                        {Number(school.rating_cache).toFixed(1)}
                                    </div>
                                    <div>
                                        <RatingStars rating={school.rating_cache} size="md" />
                                        <div className="text-[11px] text-slate-400">
                                            Based on {school.review_count_cache} reviews
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Review Form (for Logged In Users) */}
                            {auth?.user ? (
                                userReview ? (
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between text-xs text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span>You have submitted a review for this school ({userReview.rating}★). Thank you for contributing to transparency!</span>
                                        </div>
                                        <Link
                                            href={route('reviews.destroy', userReview.id)}
                                            method="delete"
                                            as="button"
                                            preserveScroll
                                            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold ml-2"
                                            title="Delete review"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Remove</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-sm font-bold text-white">Share Your Experience with {school.name}</h4>

                                        {/* Star rating selector */}
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400">Select Rating</label>
                                            <div className="flex items-center gap-2">
                                                <RatingStars
                                                    rating={reviewData.rating}
                                                    interactive={true}
                                                    onSelect={(r) => setReviewData('rating', r)}
                                                    size="lg"
                                                />
                                                <span className="text-xs font-bold text-amber-400">
                                                    {reviewData.rating} out of 5 stars
                                                </span>
                                            </div>
                                            {reviewErrors.rating && (
                                                <div className="text-xs text-rose-400">{reviewErrors.rating}</div>
                                            )}
                                        </div>

                                        {/* Comments */}
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400">Your Detailed Review</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Describe the academic atmosphere, teacher attentiveness, moral standards, sports facilities, or administrative responsiveness..."
                                                value={reviewData.comment}
                                                onChange={(e) => setReviewData('comment', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            />
                                            {reviewErrors.comment && (
                                                <div className="text-xs text-rose-400">{reviewErrors.comment}</div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={reviewProcessing}
                                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{reviewProcessing ? 'Publishing...' : 'Publish Parent Review'}</span>
                                        </button>
                                    </form>
                                )
                            ) : (
                                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 text-center space-y-2">
                                    <p className="text-xs text-slate-300">
                                        Are you a parent with a child in this school? Log in to leave a verified rating and review.
                                    </p>
                                    <Link
                                        href={route('login')}
                                        className="inline-block px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Log In to Write Review
                                    </Link>
                                </div>
                            )}

                            {/* Reviews Feed */}
                            <div className="space-y-4 pt-4">
                                {school.reviews && school.reviews.length > 0 ? (
                                    school.reviews.map((rev) => (
                                        <div
                                            key={rev.id}
                                            className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 sm:p-5 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-rose-400">
                                                        {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'P'}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">
                                                            {rev.user?.name || 'Verified Parent'}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            {new Date(rev.created_at).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <RatingStars rating={rev.rating} size="sm" />
                                            </div>

                                            <p className="text-xs text-slate-300 leading-relaxed pl-10">
                                                {rev.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-slate-400">
                                        No reviews posted yet for this school. Be the first to share your experience!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Contact & Location Card, Similar Schools */}
                    <div className="space-y-8">
                        {/* Contact Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
                            <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                                School Contact & Location
                            </h3>

                            <ul className="space-y-3.5 text-xs text-slate-300">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-white">{school.location}</div>
                                        <div className="text-slate-400 text-[11px] mt-0.5">{school.address || 'Address on file'}</div>
                                    </div>
                                </li>

                                {school.contact_phone && (
                                    <li className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                                        <a href={`tel:${school.contact_phone}`} className="hover:text-white transition-colors">
                                            {school.contact_phone}
                                        </a>
                                    </li>
                                )}

                                {school.contact_email && (
                                    <li className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                                        <a href={`mailto:${school.contact_email}`} className="hover:text-white transition-colors truncate">
                                            {school.contact_email}
                                        </a>
                                    </li>
                                )}

                                {school.website && (
                                    <li className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-rose-400 shrink-0" />
                                        <a
                                            href={school.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-rose-400 hover:underline truncate"
                                        >
                                            Visit Official Website
                                        </a>
                                    </li>
                                )}
                            </ul>

                            {/* GPS Coordinates & Map Link */}
                            {school.latitude && school.longitude && (
                                <div className="pt-2 border-t border-slate-800">
                                    <a
                                        href={`https://maps.google.com/?q=${school.latitude},${school.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                        <span>Open in Google Maps ({school.latitude.toFixed(2)}, {school.longitude.toFixed(2)})</span>
                                    </a>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={() => setTourModalOpen(true)}
                                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Request Campus Tour</span>
                                </button>
                            </div>
                        </div>

                        {/* Similar Recommendations */}
                        {similarSchools.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
                                <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                                    Similar Schools
                                </h3>

                                <div className="space-y-3">
                                            {similarSchools.map((sim, index) => (
                                        <Link
                                            key={sim.id}
                                            href={route('schools.show', sim.slug)}
                                            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                                        >
                                            <img
                                                src={getSchoolImage(sim, index)}
                                                onError={(event) => handleImageError(event, index)}
                                                alt={sim.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                                                    {sim.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                                    <span>{sim.educational_system}</span>
                                                    <span>•</span>
                                                    <span>₦{Number(sim.fees).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Campus Tour Booking Modal */}
            {tourModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-rose-500" />
                                    <span>Schedule a Campus Tour</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">{school.name}</p>
                            </div>
                            <button
                                onClick={() => setTourModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        {!auth?.user ? (
                            <div className="text-center py-6 space-y-4">
                                <p className="text-xs text-slate-300">
                                    You need an active account to request and track campus tours with school administrators.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Link
                                        href={route('login')}
                                        className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-medium"
                                    >
                                        Register Free
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleTourSubmit} className="space-y-4 text-xs">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-300">Preferred Tour Date *</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        value={tourData.preferred_date}
                                        onChange={(e) => setTourData('preferred_date', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                    {tourErrors.preferred_date && (
                                        <div className="text-rose-400 text-[11px]">{tourErrors.preferred_date}</div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-300">Preferred Time Slot *</label>
                                    <select
                                        value={tourData.time_slot}
                                        onChange={(e) => setTourData('time_slot', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="Morning (09:00 AM - 11:00 AM)">Morning (09:00 AM - 11:00 AM)</option>
                                        <option value="Midday (11:30 AM - 01:30 PM)">Midday (11:30 AM - 01:30 PM)</option>
                                        <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-300">Student Name</label>
                                        <input
                                            type="text"
                                            placeholder="Child's full name"
                                            value={tourData.student_name}
                                            onChange={(e) => setTourData('student_name', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-300">Intended Grade / Year</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Year 7 / Grade 4"
                                            value={tourData.student_grade}
                                            onChange={(e) => setTourData('student_grade', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-300">Special Inquiries / Notes</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Any specific facilities you wish to inspect (science labs, boarding hostel, sports pitch)?"
                                        value={tourData.notes}
                                        onChange={(e) => setTourData('notes', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div className="pt-3 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTourModalOpen(false)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={tourProcessing}
                                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
                                    >
                                        {tourProcessing ? 'Submitting...' : 'Confirm Tour Request'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <Footer />
            <CompareFloatingBar />
        </div>
    );
}
