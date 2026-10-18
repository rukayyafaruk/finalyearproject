import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count = null, interactive = false, onSelect = null, size = 'md' }) {
    const starSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
    };

    const currentSize = starSizes[size] || starSizes.md;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(rating);
                    return (
                        <button
                            key={star}
                            type={interactive ? 'button' : undefined}
                            disabled={!interactive}
                            onClick={() => interactive && onSelect && onSelect(star)}
                            className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'} p-0.5`}
                        >
                            <Star
                                className={`${currentSize} ${
                                    filled
                                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                                        : 'text-slate-600 fill-slate-800/40'
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
            {rating > 0 && (
                <span className="text-xs font-semibold text-slate-300 ml-1">
                    {Number(rating).toFixed(1)}
                </span>
            )}
            {count !== null && (
                <span className="text-xs text-slate-500">
                    ({count} {count === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
}
