<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Review;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    protected function ensureAdmin(): void
    {
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access: Administrator role required.');
        }
    }

    /**
     * Approve a school listing.
     */
    public function approveListing(Listing $listing): RedirectResponse
    {
        $this->ensureAdmin();

        $listing->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'rejection_reason' => null,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', "Listing for '{$listing->school->name}' has been approved and is now publicly visible!");
    }

    /**
     * Reject a school listing with a reason.
     */
    public function rejectListing(Request $request, Listing $listing): RedirectResponse
    {
        $this->ensureAdmin();

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $listing->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'rejection_reason' => $request->input('reason'),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', "Listing for '{$listing->school->name}' was rejected.");
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin();

        $request->validate([
            'role' => 'required|in:parent,school,admin',
        ]);

        // Prevent admin from removing their own admin status accidentally
        if ($user->id === Auth::id() && $request->role !== 'admin') {
            return back()->with('error', 'You cannot remove your own administrator privileges.');
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', "User '{$user->name}' role updated to {$request->role}.");
    }

    /**
     * Moderate / delete a review.
     */
    public function deleteReview(Review $review): RedirectResponse
    {
        $this->ensureAdmin();

        $school = $review->school;
        $review->delete();
        $school?->updateRatingCache();

        return back()->with('success', 'Review removed by administrator.');
    }
}
