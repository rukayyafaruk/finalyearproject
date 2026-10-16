<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolApiController extends Controller
{
    /**
     * Landing page data: featured schools, platform statistics, and available locations.
     */
    public function home(): JsonResponse
    {
        $featuredSchools = School::approved()
            ->orderBy('rating_cache', 'desc')
            ->limit(6)
            ->get();

        $stats = [
            'totalSchools' => School::approved()->count(),
            'totalReviews' => Review::count(),
            'totalParents' => User::where('role', 'parent')->count(),
            'locationsCount' => School::approved()->distinct()->count('location'),
        ];

        $availableLocations = School::approved()->distinct()->pluck('location')->sort()->values();

        return response()->json([
            'featuredSchools' => $featuredSchools,
            'stats' => $stats,
            'availableLocations' => $availableLocations,
        ]);
    }

    /**
     * School search and filtering directory with distance/algorithms.
     */
    public function index(Request $request): JsonResponse
    {
        $query = School::query()->approved()->with(['listing', 'reviews.user']);

        // 1. Text Search (Name, Location, Curriculum, Description)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('educational_system', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. Location Filter
        if ($location = $request->input('location')) {
            $query->where('location', 'like', "%{$location}%");
        }

        // 3. Educational Level Filter
        if ($level = $request->input('educational_level')) {
            $query->where('educational_level', $level);
        }

        // 4. Ownership Filter
        if ($ownership = $request->input('ownership')) {
            $query->where('ownership', $ownership);
        }

        // 5. Residential Status Filter
        if ($residential = $request->input('residential_status')) {
            $query->where('residential_status', $residential);
        }

        // 6. Educational System Filter
        if ($system = $request->input('educational_system')) {
            $query->where('educational_system', $system);
        }

        // 7. Admission Status Filter
        if ($admission = $request->input('admission_status')) {
            $query->where('admission_status', $admission);
        }

        // 8. Fee Range
        if ($minFees = $request->input('min_fees')) {
            $query->where('fees', '>=', (float) $minFees);
        }
        if ($maxFees = $request->input('max_fees')) {
            $query->where('fees', '<=', (float) $maxFees);
        }

        // 9. Minimum Rating Filter
        if ($minRating = $request->input('min_rating')) {
            $query->where('rating_cache', '>=', (float) $minRating);
        }

        // 10. Radius / Proximity calculation (Haversine Formula)
        $userLat = $request->input('latitude');
        $userLng = $request->input('longitude');
        $hasCoords = is_numeric($userLat) && is_numeric($userLng);

        if ($hasCoords) {
            $lat = (float) $userLat;
            $lng = (float) $userLng;
            $haversine = "(6371 * acos(cos(radians({$lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians({$lng})) + sin(radians({$lat})) * sin(radians(latitude))))";

            $query->selectRaw("*, {$haversine} AS distance");

            if ($radius = $request->input('radius')) {
                $query->having('distance', '<=', (float) $radius);
            }
        }

        // 11. Sorting
        $sort = $request->input('sort', 'rating_desc');
        switch ($sort) {
            case 'fees_asc':
                $query->orderBy('fees', 'asc');
                break;
            case 'fees_desc':
                $query->orderBy('fees', 'desc');
                break;
            case 'distance_asc':
                if ($hasCoords) {
                    $query->orderBy('distance', 'asc');
                } else {
                    $query->orderBy('name', 'asc');
                }
                break;
            case 'rating_asc':
                $query->orderBy('rating_cache', 'asc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'rating_desc':
            default:
                if (!$hasCoords) {
                    $query->orderBy('rating_cache', 'desc')->orderBy('review_count_cache', 'desc');
                }
                break;
        }

        $schools = $query->paginate(12)->withQueryString();
        $availableLocations = School::approved()->distinct()->pluck('location')->sort()->values();

        return response()->json([
            'schools' => $schools,
            'filters' => $request->only([
                'search',
                'location',
                'educational_level',
                'ownership',
                'residential_status',
                'educational_system',
                'admission_status',
                'min_fees',
                'max_fees',
                'min_rating',
                'latitude',
                'longitude',
                'radius',
                'sort',
            ]),
            'availableLocations' => $availableLocations,
        ]);
    }

    /**
     * Compare multiple schools.
     */
    public function compare(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }
        $ids = array_filter(array_map('intval', (array) $ids));

        $schools = [];
        if (!empty($ids)) {
            $schools = School::approved()
                ->whereIn('id', array_slice($ids, 0, 4))
                ->with(['reviews.user'])
                ->get();
        }

        $availableSchools = School::approved()
            ->orderBy('name', 'asc')
            ->select('id', 'name', 'location', 'fees', 'rating_cache', 'educational_level')
            ->get();

        return response()->json([
            'selectedSchools' => $schools,
            'availableSchools' => $availableSchools,
        ]);
    }

    /**
     * School details by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $school = School::where('slug', $slug)
            ->with([
                'listing',
                'reviews' => function ($q) {
                    $q->with('user')->latest();
                },
                'user' => function ($q) {
                    $q->select('id', 'name', 'email', 'phone');
                }
            ])
            ->firstOrFail();

        $relatedSchools = School::approved()
            ->where('id', '!=', $school->id)
            ->where(function ($q) use ($school) {
                $q->where('location', $school->location)
                  ->orWhere('educational_system', $school->educational_system);
            })
            ->limit(3)
            ->get();

        return response()->json([
            'school' => $school,
            'relatedSchools' => $relatedSchools,
        ]);
    }

    /**
     * Nearby schools by latitude and longitude.
     */
    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:500',
        ]);

        $lat = (float) $request->latitude;
        $lng = (float) $request->longitude;
        $radius = (float) $request->input('radius', 25);

        $haversine = "(6371 * acos(cos(radians({$lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians({$lng})) + sin(radians({$lat})) * sin(radians(latitude))))";

        $schools = School::approved()
            ->selectRaw("*, {$haversine} AS distance")
            ->having('distance', '<=', $radius)
            ->orderBy('distance', 'asc')
            ->limit(20)
            ->get();

        return response()->json([
            'schools' => $schools,
            'userLocation' => ['lat' => $lat, 'lng' => $lng],
            'radius' => $radius,
        ]);
    }
}
