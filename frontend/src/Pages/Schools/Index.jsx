import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { schoolsApi } from '@/api/client';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RatingStars from '@/Components/RatingStars';
import CompareFloatingBar from '@/Components/CompareFloatingBar';
import { 
    Search, MapPin, Scale, Filter, SlidersHorizontal, ArrowUpDown, 
    X, RotateCcw, Compass, ArrowRight, ShieldCheck, Check, Navigation
} from 'lucide-react';
import { getSchoolImage, handleImageError } from '@/lib/schoolImages';

export default function Index(props) {
    const [schoolsData, setSchoolsData] = useState({
        schools: props.schools || { data: [] },
        filters: props.filters || {},
        availableLocations: props.availableLocations || [],
    });

    useEffect(() => {
        if (!props.schools || !props.schools.data || props.schools.data.length === 0) {
            const queryParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(queryParams.entries());
            schoolsApi.getSchools(params)
                .then((res) => {
                    if (res.data) {
                        setSchoolsData({
                            schools: res.data.schools || { data: [] },
                            filters: res.data.filters || params,
                            availableLocations: res.data.availableLocations || [],
                        });
                    }
                })
                .catch(console.error);
        }
    }, [props.schools]);

    const { schools, filters, availableLocations } = schoolsData;

    // Local filter state initialized with current query params
    const [search, setSearch] = useState(filters.search || '');
    const [location, setLocation] = useState(filters.location || '');
    const [educationalLevel, setEducationalLevel] = useState(filters.educational_level || '');
    const [educationalSystem, setEducationalSystem] = useState(filters.educational_system || '');
    const [ownership, setOwnership] = useState(filters.ownership || '');
    const [residentialStatus, setResidentialStatus] = useState(filters.residential_status || '');
    const [admissionStatus, setAdmissionStatus] = useState(filters.admission_status || '');
    const [minFees, setMinFees] = useState(filters.min_fees || '');
    const [maxFees, setMaxFees] = useState(filters.max_fees || '');
    const [minRating, setMinRating] = useState(filters.min_rating || '');
    const [sort, setSort] = useState(filters.sort || 'rating_desc');

    // Radius / GPS shortlisting
    const [latitude, setLatitude] = useState(filters.latitude || '');
    const [longitude, setLongitude] = useState(filters.longitude || '');
    const [radius, setRadius] = useState(filters.radius || '25');
    const [geoLocating, setGeoLocating] = useState(false);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Apply filters
    const applyFilters = (customOverrides = {}) => {
        const params = {
            search,
            location,
            educational_level: educationalLevel,
            educational_system: educationalSystem,
            ownership,
            residential_status: residentialStatus,
            admission_status: admissionStatus,
            min_fees: minFees,
            max_fees: maxFees,
            min_rating: minRating,
            sort,
            latitude,
            longitude,
            radius,
            ...customOverrides,
        };

        // Remove empty keys
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get(route('schools.index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const resetFilters = () => {
        setSearch('');
        setLocation('');
        setEducationalLevel('');
        setEducationalSystem('');
        setOwnership('');
        setResidentialStatus('');
        setAdmissionStatus('');
        setMinFees('');
        setMaxFees('');
        setMinRating('');
        setLatitude('');
        setLongitude('');
        setRadius('25');
        setSort('rating_desc');
        router.get(route('schools.index'));
    };

    // Geolocation helper for Algorithm 5
    const detectCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setGeoLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const latStr = pos.coords.latitude.toFixed(6);
                const lngStr = pos.coords.longitude.toFixed(6);
                setLatitude(latStr);
                setLongitude(lngStr);
                setGeoLocating(false);
                applyFilters({
                    latitude: latStr,
                    longitude: lngStr,
                });
            },
            (err) => {
                setGeoLocating(false);
                alert('Unable to fetch your location: ' + err.message);
            }
        );
    };

    // Add to compare tray
    const addToCompare = (school) => {
        try {
            const stored = JSON.parse(
                localStorage.getItem('rukys_compare_schools') || 
                localStorage.getItem('eduselect_compare_schools') || 
                '[]'
            );
            if (stored.some((s) => s.id === school.id)) {
                return;
            }
            if (stored.length >= 3) {
                alert('You can compare up to 3 schools. Please remove one from the comparison tray.');
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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Browse Schools | Kindred Path Directory" />
            <Navbar />

            {/* Header Banner */}
            <div className="border-b border-slate-800 bg-slate-900/40 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                School Directory & Empirical Search
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Filter by curriculum, fees, boarding options, and commute distance with instant decision matrices.
                            </p>
                        </div>

                        {/* Search Input Bar */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search school name, location, curriculum..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearch(''); applyFilters({ search: '' }); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-600/20 transition-all shrink-0"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                                className="lg:hidden p-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl shrink-0"
                                title="Open filter drawer"
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content: Sidebar + Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar (Desktop & Drawer) */}
                    <aside className={`lg:w-80 shrink-0 ${filterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 sticky top-20">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                                    <span>Filter Criteria</span>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset</span>
                                </button>
                            </div>

                            {/* Location Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">City / District</label>
                                <select
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        applyFilters({ location: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="">All Locations</option>
                                    {availableLocations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Educational Level */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Educational Level</label>
                                <select
                                    value={educationalLevel}
                                    onChange={(e) => {
                                        setEducationalLevel(e.target.value);
                                        applyFilters({ educational_level: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="">All Levels</option>
                                    <option value="Nursery">Nursery / Early Years</option>
                                    <option value="Primary">Primary School</option>
                                    <option value="Secondary">Secondary / High School</option>
                                    <option value="K-12">Full K-12</option>
                                </select>
                            </div>

                            {/* Curriculum System */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Curriculum System</label>
                                <select
                                    value={educationalSystem}
                                    onChange={(e) => {
                                        setEducationalSystem(e.target.value);
                                        applyFilters({ educational_system: e.target.value });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="">All Curriculums</option>
                                    <option value="British">British National</option>
                                    <option value="American">American High School</option>
                                    <option value="Montessori">Montessori Method</option>
                                    <option value="National">National Curriculum</option>
                                    <option value="IB">International Baccalaureate (IB)</option>
                                </select>
                            </div>

                            {/* Residential Status (Day / Boarding) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Residential Provision</label>
                                <div className="grid grid-cols-3 gap-1.5 text-xs">
                                    {['', 'Day', 'Boarding'].map((opt) => (
                                        <button
                                            key={opt || 'all'}
                                            type="button"
                                            onClick={() => {
                                                setResidentialStatus(opt);
                                                applyFilters({ residential_status: opt });
                                            }}
                                            className={`py-1.5 px-2 rounded-lg border font-medium text-center transition-all ${
                                                residentialStatus === opt
                                                    ? 'bg-rose-600 border-rose-500 text-white'
                                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                                            }`}
                                        >
                                            {opt || 'Any'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ownership */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Ownership Type</label>
                                <div className="grid grid-cols-3 gap-1.5 text-xs">
                                    {['', 'Private', 'Public'].map((own) => (
                                        <button
                                            key={own || 'all-own'}
                                            type="button"
                                            onClick={() => {
                                                setOwnership(own);
                                                applyFilters({ ownership: own });
                                            }}
                                            className={`py-1.5 px-2 rounded-lg border font-medium text-center transition-all ${
                                                ownership === own
                                                    ? 'bg-rose-600 border-rose-500 text-white'
                                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                                            }`}
                                        >
                                            {own || 'Any'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tuition Fees Range */}
                            <div className="space-y-2 border-t border-slate-800 pt-4">
                                <label className="text-xs font-semibold text-slate-300">Tuition Range (₦ / term)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min ₦"
                                        value={minFees}
                                        onChange={(e) => setMinFees(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max ₦"
                                        value={maxFees}
                                        onChange={(e) => setMaxFees(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => applyFilters()}
                                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200"
                                >
                                    Apply Fee Range
                                </button>
                            </div>

                            {/* Minimum Rating */}
                            <div className="space-y-1.5 border-t border-slate-800 pt-4">
                                <label className="text-xs font-semibold text-slate-300">Minimum Parent Rating</label>
                                <div className="flex items-center gap-1.5">
                                    {[0, 3, 4, 5].map((stars) => (
                                        <button
                                            key={stars}
                                            type="button"
                                            onClick={() => {
                                                const val = stars === 0 ? '' : stars.toString();
                                                setMinRating(val);
                                                applyFilters({ min_rating: val });
                                            }}
                                            className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                                                (minRating === '' && stars === 0) || minRating === stars.toString()
                                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {stars === 0 ? 'All' : `${stars}★+`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Radius Finder (Algorithm 5: Haversine Shortlisting) */}
                            <div className="space-y-2.5 border-t border-slate-800 pt-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Proximity Radius</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={detectCurrentLocation}
                                        disabled={geoLocating}
                                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 disabled:opacity-50"
                                    >
                                        <Navigation className="w-3 h-3" />
                                        <span>{geoLocating ? 'Detecting...' : 'Use My GPS'}</span>
                                    </button>
                                </div>

                                {latitude && longitude ? (
                                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 space-y-2">
                                        <div className="text-[11px] text-emerald-300 font-mono flex items-center justify-between">
                                            <span>GPS: {Number(latitude).toFixed(3)}, {Number(longitude).toFixed(3)}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLatitude('');
                                                    setLongitude('');
                                                    applyFilters({ latitude: '', longitude: '' });
                                                }}
                                                className="text-slate-400 hover:text-rose-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] text-slate-400">
                                                <span>Radius:</span>
                                                <span className="font-bold text-white">{radius} km</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5"
                                                max="50"
                                                step="5"
                                                value={radius}
                                                onChange={(e) => {
                                                    setRadius(e.target.value);
                                                    applyFilters({ radius: e.target.value });
                                                }}
                                                className="w-full accent-emerald-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Click "Use My GPS" or enter coordinates to calculate school distance using Haversine algorithm.
                                    </p>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* School Cards Grid Section */}
                    <main className="flex-1">
                        {/* Top bar: count & sort */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-slate-300">
                                Showing <span className="font-bold text-white">{schools.data?.length || 0}</span> schools
                                {schools.total ? ` of ${schools.total} total` : ''}
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                                    <ArrowUpDown className="w-3 h-3" />
                                    <span>Sort by:</span>
                                </label>
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        applyFilters({ sort: e.target.value });
                                    }}
                                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                                >
                                    <option value="rating_desc">Highest Parent Rating</option>
                                    <option value="fees_asc">Tuition: Low to High</option>
                                    <option value="fees_desc">Tuition: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {/* School Grid */}
                        {schools.data && schools.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {schools.data.map((school) => (
                                    <div
                                        key={school.id}
                                        className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-rose-950/20"
                                    >
                                        {/* Card Image Banner */}
                                        <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                                            <img
                                                src={getSchoolImage(school)}
                                                alt={school.name}
                                                onError={(e) => handleImageError(e)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                                            {/* Top badges */}
                                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-900/90 text-white backdrop-blur-md border border-slate-700">
                                                    {school.educational_system}
                                                </span>
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/90 text-white backdrop-blur-md">
                                                    {school.educational_level}
                                                </span>
                                            </div>

                                            {/* Distance Badge if Haversine active */}
                                            {school.distance !== undefined && (
                                                <div className="absolute top-2.5 right-2.5">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                                                        <Navigation className="w-2.5 h-2.5" />
                                                        <span>{Number(school.distance).toFixed(1)} km away</span>
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                                    <span className="truncate max-w-[170px]">{school.location}</span>
                                                </div>
                                                <RatingStars rating={school.rating_cache} count={school.review_count_cache} size="sm" />
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <Link href={route('schools.show', school.slug)}>
                                                    <h3 className="text-base font-bold text-white hover:text-rose-400 transition-colors line-clamp-1">
                                                        {school.name}
                                                    </h3>
                                                </Link>
                                                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                    {school.description || 'Modern comprehensive educational institution with certified teachers and excellent amenities.'}
                                                </p>

                                                {/* Meta Pills */}
                                                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                                                        {school.residential_status}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                                                        {school.ownership}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                                                        school.admission_status === 'Open'
                                                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                                            : 'bg-slate-800 border-slate-700 text-slate-400'
                                                    }`}>
                                                        {school.admission_status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bottom bar */}
                                            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tuition</div>
                                                    <div className="text-sm font-extrabold text-white">
                                                        ₦{Number(school.fees).toLocaleString()}{' '}
                                                        <span className="text-[10px] font-normal text-slate-400">/ term</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => addToCompare(school)}
                                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                                        title="Add to compare tray"
                                                    >
                                                        <Scale className="w-4 h-4 text-amber-400" />
                                                    </button>
                                                    <Link
                                                        href={route('schools.show', school.slug)}
                                                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1"
                                                    >
                                                        <span>View</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white">No Matching Schools Found</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    We couldn't find any schools matching your current filter criteria. Try adjusting your tuition range, location, or curriculum settings.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination Links */}
                        {schools.links && schools.links.length > 3 && (
                            <div className="mt-8 flex items-center justify-center gap-1">
                                {schools.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-rose-600 text-white font-bold'
                                                : link.url
                                                ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                                                : 'text-slate-600 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
            <CompareFloatingBar />
        </div>
    );
}
