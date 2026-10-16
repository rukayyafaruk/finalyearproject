<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminApiController extends Controller
{
    public function __construct()
    {
        // Enforce admin check in constructor or route
    }

    private function checkAdmin()
    {
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized administrative action.');
        }
    }

    /**
     * Approve a school listing.
     */
    public function approveListing(Request $request, Listing $listing): JsonResponse
    {
        $this->checkAdmin();

        $listing->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'notes' => $request->input('notes'),
        ]);

        return response()->json([
            'message' => 'Listing approved and is now live to the public.',
            'listing' => $listing->load('school'),
        ]);
    }

    /**
     * Reject a school listing.
     */
    public function rejectListing(Request $request, Listing $listing): JsonResponse
    {
        $this->checkAdmin();

        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $listing->update([
            'status' => 'rejected',
            'notes' => $request->input('rejection_reason'),
        ]);

        return response()->json([
            'message' => 'Listing rejected.',
            'listing' => $listing->load('school'),
        ]);
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'role' => 'required|in:admin,parent,school',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => "User role updated to {$validated['role']}.",
            'user' => $user,
        ]);
    }

    /**
     * Delete review.
     */
    public function deleteReview(Review $review): JsonResponse
    {
        $this->checkAdmin();

        $review->delete();

        return response()->json([
            'message' => 'Review removed by administrator.'
        ]);
    }
}
