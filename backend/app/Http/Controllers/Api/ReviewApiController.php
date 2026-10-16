<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewApiController extends Controller
{
    /**
     * Store a new school review.
     */
    public function store(Request $request, School $school): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        $userId = Auth::id();

        $existing = Review::where('user_id', $userId)
            ->where('school_id', $school->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already submitted a review for this school.'
            ], 422);
        }

        $review = Review::create([
            'user_id' => $userId,
            'school_id' => $school->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Your review has been successfully published!',
            'review' => $review->load('user'),
        ], 201);
    }

    /**
     * Delete a review.
     */
    public function destroy(Review $review): JsonResponse
    {
        $user = Auth::user();

        if ($user->id !== $review->user_id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully.'
        ]);
    }
}
