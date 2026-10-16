<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SchoolProfileController extends Controller
{
    /**
     * Show form to manage or create the school profile.
     */
    public function edit(): Response
    {
        $user = Auth::user();
        $school = $user->school()->with(['listing', 'reviews.user', 'tourRequests.user'])->first();

        return Inertia::render('Dashboard/SchoolProfileEdit', [
            'school' => $school,
        ]);
    }

    /**
     * Save or update the school profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();
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
            // Check if slug taken
            if (School::where('slug', $slug)->exists()) {
                $slug .= '-' . Str::random(4);
            }

            $school = School::create(array_merge($validated, [
                'user_id' => $user->id,
                'slug' => $slug,
            ]));

            // Create initial pending listing
            Listing::create([
                'school_id' => $school->id,
                'status' => 'pending',
            ]);

            return redirect()->route('dashboard')->with('success', 'School profile registered! Your listing is submitted for administrative verification.');
        } else {
            // Update existing school
            $school->update($validated);

            // Ensure listing exists
            if (!$school->listing) {
                Listing::create([
                    'school_id' => $school->id,
                    'status' => 'pending',
                ]);
            }

            return redirect()->route('dashboard')->with('success', 'School profile updated successfully!');
        }
    }
}
