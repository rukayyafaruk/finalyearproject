import { useForm, Head, Link } from '@inertiajs/react';
import { School, User, Lock, Mail, Phone, MapPin, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'parent', // 'parent' or 'school'
        phone: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Create Account | Kindred Path" />

            {/* Glowing ambient background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 space-y-6">
                {/* Brand Logo & Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-400/30">
                            <span className="font-display font-extrabold text-white text-2xl">R</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Join Kindred Path
                    </h1>
                    <p className="text-xs text-slate-400">
                        Create your account to evaluate schools or register your institution.
                    </p>
                </div>

                {/* Registration Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-xl space-y-6">
                    {/* Role Selector Toggle */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">I am registering as:</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setData('role', 'parent')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                    data.role === 'parent'
                                        ? 'bg-rose-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Parent / Guardian</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('role', 'school')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                    data.role === 'school'
                                        ? 'bg-rose-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>School Official</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4 text-xs">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-rose-400" />
                                <span>{data.role === 'school' ? 'Representative Full Name' : 'Full Name'} *</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Dr. Michael Adeyemi"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            {errors.name && <div className="text-rose-400 text-[11px]">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-rose-400" />
                                <span>Email Address *</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            {errors.email && <div className="text-rose-400 text-[11px]">{errors.email}</div>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-rose-400" />
                                <span>Contact Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="+234 800 000 0000"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                <span>Residential / Campus Location</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Lekki Phase 1, Lagos"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Password *</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                {errors.password && <div className="text-rose-400 text-[11px]">{errors.password}</div>}
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Confirm Password *</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            >
                                <span>{processing ? 'Creating Account...' : 'Complete Registration'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-rose-400 hover:text-rose-300 font-semibold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
