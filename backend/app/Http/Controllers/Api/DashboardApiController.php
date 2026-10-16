<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\School;
use App\Models\TourRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardApiController extends Controller
{
    /**
     * Unified Role-based Dashboard API.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        // 1. Administrator Dashboard
        if ($user->isAdmin()) {
            $stats = [
                'total_schools' => School::count(),
                'approved_listings' => Listing::where('status', 'approved')->count(),
                'pending_listings' => Listing::where('status', 'pending')->count(),
                'rejected_listings' => Listing::where('status', 'rejected')->count(),
                'total_parents' => User::where('role', 'parent')->count(),
                'total_schools_reps' => User::where('role', 'school')->count(),
                'total_reviews' => Review::count(),
                'total_tours' => TourRequest::count(),
            ];

            $pendingListings = Listing::with('school.user')
                ->where('status', 'pending')
                ->latest()
                ->get();

            $allListings = Listing::with(['school.user', 'approver'])
                ->latest()
                ->paginate(15, ['*'], 'listings_page');

            $allUsers = User::latest()
                ->paginate(15, ['*'], 'users_page');

            $recentReviews = Review::with(['user', 'school'])
                ->latest()
                ->limit(10)
                ->get();

            return response()->json([
                'role' => 'admin',
                'stats' => $stats,
                'pendingListings' => $pendingListings,
                'allListings' => $allListings,
                'allUsers' => $allUsers,
                'recentReviews' => $recentReviews,
            ]);
        }

        // 2. School Representative Dashboard
        if ($user->isSchool()) {
            $school = School::where('user_id', $user->id)
                ->with([
                    'listing',
                    'reviews.user',
                    'tourRequests.user',
                ])
                ->first();

            $tourRequests = $school
                ? $school->tourRequests()->with('user')->latest()->get()
                : [];

            $reviews = $school
                ? $school->reviews()->with('user')->latest()->get()
                : [];

            return response()->json([
                'role' => 'school',
                'school' => $school,
                'tourRequests' => $tourRequests,
                'reviews' => $reviews,
            ]);
        }

        // 3. Parent / Guardian Dashboard (Default)
        $tourRequests = TourRequest::where('user_id', $user->id)
            ->with('school')
            ->latest()
            ->get();

        $reviews = Review::where('user_id', $user->id)
            ->with('school')
            ->latest()
            ->get();

        $recommendedSchools = School::approved()
            ->orderBy('rating_cache', 'desc')
            ->limit(4)
            ->get();

        return response()->json([
            'role' => 'parent',
            'tourRequests' => $tourRequests,
            'reviews' => $reviews,
            'recommendedSchools' => $recommendedSchools,
        ]);
    }
}
