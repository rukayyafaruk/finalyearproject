<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new school review (Algorithm 4: Submit Review).
     */
    public function store(Request $request, School $school): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        $userId = Auth::id();

        // Ensure user hasn't already submitted a review for this school
        $existing = Review::where('user_id', $userId)
            ->where('school_id', $school->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already submitted a review for this school.');
        }

        Review::create([
            'user_id' => $userId,
            'school_id' => $school->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Your review has been successfully published!');
    }

    /**
     * Delete a review.
     */
    public function destroy(Review $review): RedirectResponse
    {
        $user = Auth::user();

        // Only author or admin can delete
        if ($user->id !== $review->user_id && !$user->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
