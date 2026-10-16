<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\TourRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TourRequestController extends Controller
{
    /**
     * Submit a tour request from a parent.
     */
    public function store(Request $request, School $school): RedirectResponse
    {
        $validated = $request->validate([
            'preferred_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string|max:100',
            'student_name' => 'nullable|string|max:255',
            'student_grade' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        TourRequest::create([
            'user_id' => Auth::id(),
            'school_id' => $school->id,
            'preferred_date' => $validated['preferred_date'],
            'time_slot' => $validated['time_slot'],
            'student_name' => $validated['student_name'] ?? null,
            'student_grade' => $validated['student_grade'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your campus tour request has been submitted to the school administration!');
    }

    /**
     * Update the status of a tour request (by school owner or admin).
     */
    public function updateStatus(Request $request, TourRequest $tourRequest): RedirectResponse
    {
        $user = Auth::user();

        // Check permission: must be school owner or admin
        $school = $tourRequest->school;
        if (!$user->isAdmin() && $school->user_id !== $user->id) {
            abort(403, 'Unauthorized to manage this tour request.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $tourRequest->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Tour status updated to {$validated['status']}.");
    }
}
