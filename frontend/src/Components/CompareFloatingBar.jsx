import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function CompareFloatingBar() {
    const [comparedSchools, setComparedSchools] = useState([]);

    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const stored = localStorage.getItem('eduselect_compare_schools');
                if (stored) {
                    setComparedSchools(JSON.parse(stored));
                }
            } catch (e) {
                console.error(e);
            }
        };

        loadFromStorage();
        window.addEventListener('storage', loadFromStorage);
        window.addEventListener('eduselect_compare_updated', loadFromStorage);

        return () => {
            window.removeEventListener('storage', loadFromStorage);
            window.removeEventListener('eduselect_compare_updated', loadFromStorage);
        };
    }, []);

    const removeSchool = (id) => {
        const updated = comparedSchools.filter((s) => s.id !== id);
        setComparedSchools(updated);
        localStorage.setItem('eduselect_compare_schools', JSON.stringify(updated));
        window.dispatchEvent(new Event('eduselect_compare_updated'));
    };

    const clearAll = () => {
        setComparedSchools([]);
        localStorage.removeItem('eduselect_compare_schools');
        window.dispatchEvent(new Event('eduselect_compare_updated'));
    };

    if (comparedSchools.length === 0) return null;

    const idsParam = comparedSchools.map((s) => s.id).join(',');

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-rose-950/40 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shrink-0 shadow-md">
                        <Scale className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Compare Tray</span>
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {comparedSchools.length} / 3 Schools
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 hidden sm:block">Side-by-side analysis ready</p>
                    </div>
                </div>

                {/* Selected School Chips */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1">
                    {comparedSchools.map((school) => (
                        <div
                            key={school.id}
                            className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-lg pl-2 pr-1.5 py-1 text-xs text-slate-200 shrink-0"
                        >
                            {school.featured_image && (
                                <img
                                    src={school.featured_image}
                                    alt={school.name}
                                    className="w-5 h-5 rounded-md object-cover"
                                />
                            )}
                            <span className="max-w-[110px] truncate font-medium">{school.name}</span>
                            <button
                                onClick={() => removeSchool(school.id)}
                                className="p-0.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
                                title="Remove"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                        onClick={clearAll}
                        className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                        title="Clear selection"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                    <Link
                        href={route('schools.compare', { ids: idsParam })}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Compare Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
