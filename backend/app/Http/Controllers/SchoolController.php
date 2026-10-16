<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class SchoolController extends Controller
{
    /**
     * Display a listing of schools with filtering, searching, and location radius.
     * Implements Algorithm 1 (School Search), Algorithm 2 (Filter Schools), and Algorithm 5 (Location-based shortlisting).
     */
    public function index(Request $request): Response
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

        // 2. Specific Location Filter
        if ($location = $request->input('location')) {
            $query->where('location', 'like', "%{$location}%");
        }

        // 3. Educational Level Filter
        if ($level = $request->input('educational_level')) {
            $query->where('educational_level', $level);
        }

        // 4. Ownership Filter (Public, Private, Mission)
        if ($ownership = $request->input('ownership')) {
            $query->where('ownership', $ownership);
        }

        // 5. Residential Status Filter (Day, Boarding, Day & Boarding)
        if ($residential = $request->input('residential_status')) {
            $query->where('residential_status', $residential);
        }

        // 6. Educational System / Curriculum (British, American, National, Montessori, IB)
        if ($system = $request->input('educational_system')) {
            $query->where('educational_system', $system);
        }

        // 7. Admission Status Filter (Open, In Progress, Closed)
        if ($admission = $request->input('admission_status')) {
            $query->where('admission_status', $admission);
        }

        // 8. Fees Range Filter
        if ($minFees = $request->input('min_fees')) {
            $query->where('fees', '>=', (int) $minFees);
        }
        if ($maxFees = $request->input('max_fees')) {
            $query->where('fees', '<=', (int) $maxFees);
        }

        // 9. Minimum Rating Filter
        if ($minRating = $request->input('min_rating')) {
            $query->where('rating_cache', '>=', (float) $minRating);
        }

        // 10. Location-based Shortlisting via Haversine Formula (Algorithm 5)
        $hasCoords = false;
        if ($request->filled('latitude') && $request->filled('longitude')) {
            $lat = (float) $request->input('latitude');
            $lng = (float) $request->input('longitude');
            $radius = (float) ($request->input('radius') ?: 25); // default 25km

            $query->withinRadius($lat, $lng, $radius);
            $hasCoords = true;
        }

        // Sorting
        $sort = $request->input('sort', 'rating_desc');
        switch ($sort) {
            case 'fees_asc':
                $query->orderBy('fees', 'asc');
                break;
            case 'fees_desc':
                $query->orderBy('fees', 'desc');
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

        // Extract distinct locations for filter dropdowns
        $availableLocations = School::approved()->distinct()->pluck('location')->sort()->values();

        return Inertia::render('Schools/Index', [
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
     * Display the specified school details.
     */
    public function show(string $slug): Response
    {
        $school = School::where('slug', $slug)
            ->with([
                'listing',
                'reviews' => function ($q) {
                    $q->with('user:id,name')->latest();
                },
            ])
            ->firstOrFail();

        // Check if logged in user has already reviewed
        $userReview = null;
        $userTourRequest = null;
        if ($userId = auth()->id()) {
            $userReview = $school->reviews->firstWhere('user_id', $userId);
            $userTourRequest = $school->tourRequests()->where('user_id', $userId)->latest()->first();
        }

        // Similar schools recommendations
        $similarSchools = School::approved()
            ->where('id', '!=', $school->id)
            ->where(function ($q) use ($school) {
                $q->where('educational_level', $school->educational_level)
                  ->orWhere('location', $school->location)
                  ->orWhere('educational_system', $school->educational_system);
            })
            ->limit(3)
            ->get();

        return Inertia::render('Schools/Show', [
            'school' => $school,
            'userReview' => $userReview,
            'userTourRequest' => $userTourRequest,
            'similarSchools' => $similarSchools,
        ]);
    }

    /**
     * Compare up to 3 schools side-by-side (Algorithm 3).
     */
    public function compare(Request $request): Response
    {
        $rawIds = $request->input('ids');
        $ids = [];
        if (is_array($rawIds)) {
            $ids = array_slice($rawIds, 0, 3);
        } elseif (is_string($rawIds)) {
            $ids = array_slice(array_filter(explode(',', $rawIds)), 0, 3);
        }

        $schools = count($ids) > 0
            ? School::whereIn('id', $ids)->with('reviews')->get()
            : collect();

        $allSchoolsList = School::approved()->select('id', 'name', 'location', 'featured_image')->get();

        return Inertia::render('Schools/Compare', [
            'selectedSchools' => $schools,
            'selectedIds' => $ids,
            'allSchoolsList' => $allSchoolsList,
        ]);
    }

    /**
     * API for Location-based Shortlisting using Haversine formula (Algorithm 5).
     */
    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'nullable|numeric|min:1|max:200',
        ]);

        $lat = (float) $request->input('latitude');
        $lng = (float) $request->input('longitude');
        $radius = (float) ($request->input('radius') ?: 25);

        $schools = School::approved()
            ->withinRadius($lat, $lng, $radius)
            ->get();

        return response()->json([
            'status' => 'success',
            'radius_km' => $radius,
            'count' => $schools->count(),
            'data' => $schools,
        ]);
    }
}
