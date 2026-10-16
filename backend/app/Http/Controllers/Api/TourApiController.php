<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\TourRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TourApiController extends Controller
{
    /**
     * Store a campus tour booking request.
     */
    public function store(Request $request, School $school): JsonResponse
    {
        $validated = $request->validate([
            'tour_date' => 'required|date|after_or_equal:today',
            'contact_phone' => 'required|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ]);

        $tour = TourRequest::create([
            'user_id' => Auth::id(),
            'school_id' => $school->id,
            'tour_date' => $validated['tour_date'],
            'contact_phone' => $validated['contact_phone'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Tour request booked successfully! The school administration has been notified.',
            'tour' => $tour->load('school'),
        ], 201);
    }

    /**
     * Update tour request status (School rep or admin).
     */
    public function updateStatus(Request $request, TourRequest $tourRequest): JsonResponse
    {
        $user = Auth::user();

        // Check permission: must be school rep of this school or admin
        if (!$user->isAdmin() && (!$user->isSchool() || $tourRequest->school->user_id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $tourRequest->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => "Tour request status updated to {$validated['status']}.",
            'tour' => $tourRequest,
        ]);
    }
}
