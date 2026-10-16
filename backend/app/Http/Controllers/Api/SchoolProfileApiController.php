<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SchoolProfileApiController extends Controller
{
    /**
     * Get the authenticated representative's school profile.
     */
    public function show(): JsonResponse
    {
        $user = Auth::user();
        $school = $user->school()->with(['listing', 'reviews.user', 'tourRequests.user'])->first();

        return response()->json([
            'school' => $school,
        ]);
    }

    /**
     * Save or update representative's school profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isSchool() && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Only school representatives can manage school profiles.'], 403);
        }

        $school = $user->school;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'fees' => 'required|numeric|min:0',
            'ownership' => 'required|in:Public,Private,Mission',
            'educational_level' => 'required|in:Nursery,Primary,Secondary,K-12',
            'residential_status' => 'required|in:Day,Boarding,Day & Boarding',
            'educational_system' => 'required|in:British,American,National,Montessori,IB',
            'description' => 'nullable|string|max:3000',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'admission_status' => 'required|in:Open,Closed,In Progress',
            'featured_image' => 'nullable|string|max:1000',
        ]);

        $slug = Str::slug($validated['name']);

        if (!$school) {
            if (School::where('slug', $slug)->exists()) {
                $slug .= '-' . Str::random(4);
            }

            $school = School::create(array_merge($validated, [
                'user_id' => $user->id,
                'slug' => $slug,
            ]));

            Listing::create([
                'school_id' => $school->id,
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'School profile registered! Your listing is submitted for administrative verification.',
                'school' => $school->load('listing'),
            ], 201);
        } else {
            $school->update($validated);

            if (!$school->listing) {
                Listing::create([
                    'school_id' => $school->id,
                    'status' => 'pending',
                ]);
            }

            return response()->json([
                'message' => 'School profile updated successfully!',
                'school' => $school->load('listing'),
            ]);
        }
    }
}
