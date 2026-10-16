<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'location',
        'address',
        'latitude',
        'longitude',
        'fees',
        'ownership',
        'educational_level',
        'residential_status',
        'educational_system',
        'description',
        'contact_email',
        'contact_phone',
        'website',
        'admission_status',
        'featured_image',
        'rating_cache',
        'review_count_cache',
    ];

    protected $casts = [
        'fees' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'rating_cache' => 'float',
        'review_count_cache' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function listing(): HasOne
    {
        return $this->hasOne(Listing::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest();
    }

    public function tourRequests(): HasMany
    {
        return $this->hasMany(TourRequest::class)->latest();
    }

    /**
     * Scope to only include approved schools
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->whereHas('listing', function ($q) {
            $q->where('status', 'approved');
        });
    }

    /**
     * Scope for Location-based Shortlisting using Haversine Formula (Algorithm 5)
     */
    public function scopeWithinRadius(Builder $query, float $latitude, float $longitude, float $radiusKm = 25): Builder
    {
        $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";

        return $query
            ->select('schools.*')
            ->selectRaw("{$haversine} AS distance", [$latitude, $longitude, $latitude])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->having('distance', '<=', $radiusKm)
            ->orderBy('distance', 'asc');
    }

    /**
     * Refresh rating cache from actual reviews
     */
    public function updateRatingCache(): void
    {
        $avg = $this->reviews()->avg('rating') ?: 0;
        $count = $this->reviews()->count();

        $this->update([
            'rating_cache' => round($avg, 2),
            'review_count_cache' => $count,
        ]);
    }
}
