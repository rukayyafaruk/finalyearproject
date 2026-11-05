import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { interactionsApi } from '@/api/client';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { getSchoolImage } from '@/lib/schoolImages';
import { 
    Building2, Save, ArrowLeft, CheckCircle2, AlertCircle, 
    MapPin, Globe, Phone, Mail, DollarSign, BookOpen, Compass, Loader2
} from 'lucide-react';

export default function SchoolProfileEdit(props) {
    const [school, setSchool] = useState(props.school || null);
    const [loading, setLoading] = useState(!props.school);

    useEffect(() => {
        if (!props.school) {
            interactionsApi.getSchoolProfile()
                .then((res) => {
                    if (res.data?.school) {
                        setSchool(res.data.school);
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [props.school]);
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: school?.name || '',
        location: school?.location || '',
        address: school?.address || '',
        latitude: school?.latitude || '',
        longitude: school?.longitude || '',
        fees: school?.fees || '',
        ownership: school?.ownership || 'Private',
        educational_level: school?.educational_level || 'Secondary',
        residential_status: school?.residential_status || 'Day',
        educational_system: school?.educational_system || 'National',
        description: school?.description || '',
        contact_email: school?.contact_email || '',
        contact_phone: school?.contact_phone || '',
        website: school?.website || '',
        admission_status: school?.admission_status || 'Open',
        featured_image: school ? getSchoolImage(school) : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('school-profile.update'));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
            <Head title={school ? `Edit Profile | ${school.name}` : 'Register School Profile'} />
            <Navbar />

            {/* Flash Alerts */}
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href={route('dashboard')} className="text-xs text-rose-400 hover:underline flex items-center gap-1 mb-2">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to School Workspace</span>
                            </Link>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {school ? 'Update Institutional Specifications' : 'Register Official School Profile'}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Maintain accurate tuition, curriculum models, and contact information for prospective parents.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                            1. General Identification
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1 sm:col-span-2">
                                <label className="font-semibold text-slate-300">Official School Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Green Valley International Academy"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {errors.name && <div className="text-rose-400 text-[11px]">{errors.name}</div>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">City / District *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Victoria Island, Lagos"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {errors.location && <div className="text-rose-400 text-[11px]">{errors.location}</div>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Physical Campus Address</label>
                                <input
                                    type="text"
                                    placeholder="Plot number, Street, Landmark"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {errors.address && <div className="text-rose-400 text-[11px]">{errors.address}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Academic & Structural Configuration */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                            2. Academic & Residential Model
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Curriculum Model *</label>
                                <select
                                    value={data.educational_system}
                                    onChange={(e) => setData('educational_system', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="British">British National</option>
                                    <option value="American">American Curriculum</option>
                                    <option value="Montessori">Montessori Method</option>
                                    <option value="National">National Curriculum</option>
                                    <option value="IB">International Baccalaureate (IB)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Educational Level *</label>
                                <select
                                    value={data.educational_level}
                                    onChange={(e) => setData('educational_level', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Nursery">Nursery / Early Years</option>
                                    <option value="Primary">Primary Elementary</option>
                                    <option value="Secondary">Secondary / High School</option>
                                    <option value="K-12">Full K-12</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Residential Provision *</label>
                                <select
                                    value={data.residential_status}
                                    onChange={(e) => setData('residential_status', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Day">Day Only</option>
                                    <option value="Boarding">Boarding Only</option>
                                    <option value="Day & Boarding">Day & Boarding</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Ownership Structure *</label>
                                <select
                                    value={data.ownership}
                                    onChange={(e) => setData('ownership', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Private">Private</option>
                                    <option value="Public">Public / Federal / State</option>
                                    <option value="Mission">Mission / Faith-Based</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Tuition Fee / Term (₦) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="e.g. 750000"
                                    value={data.fees}
                                    onChange={(e) => setData('fees', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {errors.fees && <div className="text-rose-400 text-[11px]">{errors.fees}</div>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Admission Intake Cycle *</label>
                                <select
                                    value={data.admission_status}
                                    onChange={(e) => setData('admission_status', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Open">Open for Admissions</option>
                                    <option value="In Progress">Intake In Progress</option>
                                    <option value="Closed">Admissions Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Geolocation & Media */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                            3. Coordinates & Media Asset
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Latitude (GPS)</label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    placeholder="e.g. 6.4281"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Longitude (GPS)</label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    placeholder="e.g. 3.4219"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Featured Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://... campus photo"
                                    value={data.featured_image}
                                    onChange={(e) => setData('featured_image', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Narrative */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                            4. Institutional Overview & Contact
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Contact Email</label>
                                <input
                                    type="email"
                                    placeholder="admissions@yourschool.edu"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Contact Telephone</label>
                                <input
                                    type="text"
                                    placeholder="+234 800 000 0000"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300">Official Website URL</label>
                                <input
                                    type="url"
                                    placeholder="https://yourschool.edu.ng"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 text-xs">
                            <label className="font-semibold text-slate-300">Detailed Institutional Description & Mission</label>
                            <textarea
                                rows={5}
                                placeholder="Detail your school's history, academic achievements, laboratories, arts & athletics facilities, co-curricular clubs..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href={route('dashboard')}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-7 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save School Profile'}</span>
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}
