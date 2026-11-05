import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { schoolsApi } from '@/api/client';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import CompareFloatingBar from '@/Components/CompareFloatingBar';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';
import {
    Scale, Plus, X, ArrowLeft, MapPin, Loader2
} from 'lucide-react';

export default function Compare(props) {
    const [compareData, setCompareData] = useState({
        selectedSchools: props.selectedSchools || [],
        selectedIds: props.selectedIds || [],
        allSchoolsList: props.allSchoolsList || [],
    });
    const [loading, setLoading] = useState(false);
    const [selectorModalOpen, setSelectorModalOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');

    // Fetch the comparison for a list of ids and update the page without an Inertia visit.
    const loadCompare = (ids) => {
        const cleanIds = ids.filter((id) => id !== '' && id !== null && id !== undefined);
        setLoading(true);
        return schoolsApi.compareSchools(cleanIds.join(','))
            .then((res) => {
                if (res.data) {
                    setCompareData((prev) => ({
                        selectedSchools: res.data.selectedSchools || [],
                        selectedIds: cleanIds,
                        allSchoolsList: res.data.availableSchools || prev.allSchoolsList,
                    }));
                    // Keep the URL in sync without triggering a page visit
                    try {
                        const qs = cleanIds.length ? `?ids=${cleanIds.join(',')}` : '';
                        window.history.replaceState({}, '', `${route('schools.compare')}${qs}`);
                    } catch (e) { }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    // Initial load / props sync
    useEffect(() => {
        if (props.selectedSchools && props.selectedSchools.length > 0) {
            // Server rendered the page with data (e.g. arriving from the floating bar)
            setCompareData({
                selectedSchools: props.selectedSchools,
                selectedIds: props.selectedIds || [],
                allSchoolsList: props.allSchoolsList || [],
            });
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        let idsStr = urlParams.get('ids');
        if (!idsStr) {
            try {
                const stored = JSON.parse(localStorage.getItem('eduselect_compare_schools') || '[]');
                idsStr = stored.map((s) => s.id).join(',');
            } catch (e) { }
        }
        loadCompare(idsStr ? idsStr.split(',') : []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedSchools]);

    const { selectedSchools, allSchoolsList } = compareData;

    // Remove school from compare
    const removeSchool = (id) => {
        const remaining = selectedSchools.filter((s) => s.id !== id).map((s) => s.id);
        // Also update local storage compare tray
        try {
            const stored = JSON.parse(localStorage.getItem('eduselect_compare_schools') || '[]');
            const updated = stored.filter((s) => s.id !== id);
            localStorage.setItem('eduselect_compare_schools', JSON.stringify(updated));
            window.dispatchEvent(new Event('eduselect_compare_updated'));
        } catch (e) { }

        loadCompare(remaining);
    };

    // Add school from modal selector
    const addSchool = (school) => {
        if (selectedSchools.some((s) => s.id === school.id)) {
            return;
        }
        if (selectedSchools.length >= 3) {
            alert('Maximum of 3 schools can be compared at one time.');
            return;
        }
        const updatedIds = [...selectedSchools.map((s) => s.id), school.id];

        // Also update local storage tray
        try {
            const stored = JSON.parse(localStorage.getItem('eduselect_compare_schools') || '[]');
            const updated = [...stored, {
                id: school.id,
                name: school.name,
                featured_image: school.featured_image,
                location: school.location,
            }];
            localStorage.setItem('eduselect_compare_schools', JSON.stringify(updated));
            window.dispatchEvent(new Event('eduselect_compare_updated'));
        } catch (e) { }

        setSelectorModalOpen(false);
        setSearchFilter('');
        loadCompare(updatedIds);
    };

    // Calculate minimum fee among compared schools for highlighting
    const feesList = selectedSchools.map((s) => Number(s.fees)).filter((f) => f > 0);
    const minFee = feesList.length > 0 ? Math.min(...feesList) : null;

    // Filter available schools in modal
    const modalSchools = allSchoolsList.filter(
        (s) =>
            !selectedSchools.some((sel) => sel.id === s.id) &&
            s.name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="3-Way Side-by-Side School Comparison | Kindred Path" />
            <Navbar />

            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                                <Scale className="w-4 h-4" />
                                <span>Algorithm 3: Side-by-Side Evaluation</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Compare Candidate Schools
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Evaluate curriculum differences, fee structures, boarding status, and community ratings across up to 3 selected institutions.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={route('schools.index')}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Directory</span>
                            </Link>
                            {selectedSchools.length < 3 && (
                                <button
                                    onClick={() => setSelectorModalOpen(true)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add School ({selectedSchools.length}/3)</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Comparison Matrix */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                    </div>
                )}

                <div className={`transition-all duration-300 ${loading ? 'blur-sm pointer-events-none select-none' : ''}`}>
                    {selectedSchools.length === 0 && !loading ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                                <Scale className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No Schools Selected for Comparison</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Pick up to three schools from our verified directory to inspect side-by-side matrices of fees, academic curriculum, boarding accommodation, and parental feedback.
                            </p>
                            <div className="pt-2 flex justify-center gap-3">
                                <button
                                    onClick={() => setSelectorModalOpen(true)}
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
                                >
                                    Pick Schools to Compare
                                </button>
                                <Link
                                    href={route('schools.index')}
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                                >
                                    Browse School Directory
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/60">
                                        <th className="p-4 sm:p-6 w-1/4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Evaluation Metric
                                        </th>
                                        {selectedSchools.map((school, index) => (
                                            <th key={school.id} className="p-4 sm:p-6 w-1/4 align-top relative">
                                                <button
                                                    onClick={() => removeSchool(school.id)}
                                                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white transition-colors"
                                                    title="Remove this school from comparison"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="space-y-3 pr-6">
                                                    <img
                                                        src={getSchoolImage(school, index)}
                                                        onError={(event) => handleImageError(event, index)}
                                                        alt={school.name}
                                                        className="w-full h-32 rounded-xl object-cover"
                                                    />
                                                    <Link href={route('schools.show', school.slug)}>
                                                        <h3 className="text-base font-bold text-white hover:text-rose-400 transition-colors line-clamp-1">
                                                            {school.name}
                                                        </h3>
                                                    </Link>
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                                        <span className="truncate">{school.location}</span>
                                                    </div>
                                                    <RatingStars rating={school.rating_cache} count={school.review_count_cache} size="sm" />
                                                </div>
                                            </th>
                                        ))}

                                        {/* Empty Slot if less than 3 */}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <th key={`empty-${i}`} className="p-4 sm:p-6 w-1/4 align-middle text-center bg-slate-900/30 border-l border-slate-800/60">
                                                <div
                                                    className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors"
                                                    onClick={() => setSelectorModalOpen(true)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-400">Add School Slot</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                                    {/* Tuition Fees Row */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Estimated Tuition / Term
                                        </td>
                                        {selectedSchools.map((school) => {
                                            const isLowest = minFee && Number(school.fees) === minFee && selectedSchools.length > 1;
                                            return (
                                                <td key={school.id} className="p-4 sm:p-5">
                                                    <div className="text-base font-extrabold text-white">
                                                        ₦{Number(school.fees).toLocaleString()}
                                                    </div>
                                                    {isLowest && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                            Most Affordable Option
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-fees-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Curriculum Row */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Academic Curriculum System
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5">
                                                <span className="px-2.5 py-1 rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-300 font-bold">
                                                    {school.educational_system}
                                                </span>
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-curriculum-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Educational Level */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Educational Level
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5 font-semibold text-white">
                                                {school.educational_level}
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-level-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Residential Provision */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Residential Status
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5 font-semibold text-slate-200">
                                                {school.residential_status}
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-res-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Ownership */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Ownership Structure
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5">
                                                {school.ownership}
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-own-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Admission Intake Status */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Admission Status
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5">
                                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${school.admission_status === 'Open'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                        : school.admission_status === 'In Progress'
                                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                                            : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                    {school.admission_status}
                                                </span>
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-adm-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Verified Rating */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Parent Satisfaction Score
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5">
                                                <div className="font-bold text-white text-sm">
                                                    {Number(school.rating_cache).toFixed(1)} / 5.0
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">
                                                    {school.review_count_cache} verified community ratings
                                                </div>
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-rating-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Contact Details */}
                                    <tr className="hover:bg-slate-850/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Direct Contact Information
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5 space-y-1">
                                                {school.contact_phone && (
                                                    <div className="text-slate-300 font-mono text-[11px]">{school.contact_phone}</div>
                                                )}
                                                {school.contact_email && (
                                                    <div className="text-slate-400 truncate max-w-[200px] text-[11px]">{school.contact_email}</div>
                                                )}
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-contact-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>

                                    {/* Direct CTA Buttons */}
                                    <tr className="bg-slate-950/50">
                                        <td className="p-4 sm:p-5 font-bold text-slate-400 bg-slate-950/30">
                                            Next Steps
                                        </td>
                                        {selectedSchools.map((school) => (
                                            <td key={school.id} className="p-4 sm:p-5 space-y-2">
                                                <Link
                                                    href={route('schools.show', school.slug)}
                                                    className="block w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-center font-bold text-xs shadow-md transition-all"
                                                >
                                                    Full Profile & Tour Booking
                                                </Link>
                                            </td>
                                        ))}
                                        {Array.from({ length: 3 - selectedSchools.length }).map((_, i) => (
                                            <td key={`empty-cta-${i}`} className="p-4 sm:p-5 text-slate-600">—</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* School Selector Modal */}
            {selectorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Plus className="w-4 h-4 text-rose-500" />
                                <span>Add School to Comparison</span>
                            </h3>
                            <button
                                onClick={() => setSelectorModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search in modal */}
                        <input
                            type="text"
                            placeholder="Type school name to filter..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />

                        {/* Schools List */}
                        <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-800/60 pr-1">
                            {modalSchools.length > 0 ? (
                                modalSchools.map((sch, index) => (
                                    <div
                                        key={sch.id}
                                        onClick={() => addSchool(sch)}
                                        className="pt-2 flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getSchoolImage(sch, index)}
                                                onError={(event) => handleImageError(event, index)}
                                                alt={sch.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                                                    {sch.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400">{sch.location}</div>
                                            </div>
                                        </div>

                                        <button className="px-3 py-1 bg-rose-600 group-hover:bg-rose-500 text-white rounded-lg text-xs font-semibold">
                                            Select
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-xs text-slate-400">
                                    No available schools found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            <CompareFloatingBar />
        </div>
    );
}
