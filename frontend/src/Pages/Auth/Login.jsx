import { useForm, Head, Link } from '@inertiajs/react';
import { School, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Building2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Quick demo login filler
    const fillCredentials = (email, password) => {
        setData((prev) => ({
            ...prev,
            email,
            password,
        }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Sign In | Kindred Path" />

            {/* Glowing background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <img
                            src="/images/kindred-path-mark.webp"
                            alt="Kindred Path"
                            className="mx-auto h-16 w-16 rounded-2xl bg-white p-0.5 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-[1.02]"
                        />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Sign In to Kindred Path
                    </h1>
                    <p className="text-xs text-slate-400">
                        Sign in to access your parent inquiries, school profile, or administrative oversight.
                    </p>
                </div>

                {/* Status alert */}
                {status && (
                    <div className="bg-emerald-600/90 text-white px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md">
                        {status}
                    </div>
                )}

                {/* Login Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-xl space-y-6">
                    <form onSubmit={submit} className="space-y-4 text-xs">
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-rose-400" />
                                <span>Email Address</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="name@domain.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            {errors.email && <div className="text-rose-400 text-[11px]">{errors.email}</div>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Password</span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            {errors.password && <div className="text-rose-400 text-[11px]">{errors.password}</div>}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-rose-500"
                                />
                                <span className="text-slate-400">Remember session on this device</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            >
                                <span>{processing ? 'Authenticating...' : 'Sign In'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Quick Demo Credentials for Evaluation & Testing */}
                    <div className="pt-4 border-t border-slate-800 space-y-2.5">
                        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-center">
                            Quick Evaluation Accounts
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin@schoolfinder.com', 'password123')}
                                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all flex flex-col items-center gap-1 text-center"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                                <span className="font-bold">Admin</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fillCredentials('parent@example.com', 'password123')}
                                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all flex flex-col items-center gap-1 text-center"
                            >
                                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-bold">Parent</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fillCredentials('principal@greenvalley.com', 'password123')}
                                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all flex flex-col items-center gap-1 text-center"
                            >
                                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-bold">School Rep</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <Link href={route('register')} className="text-rose-400 hover:text-rose-300 font-semibold">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
