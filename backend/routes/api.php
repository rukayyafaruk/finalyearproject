<?php

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\ProfileApiController;
use App\Http\Controllers\Api\ReviewApiController;
use App\Http\Controllers\Api\SchoolApiController;
use App\Http\Controllers\Api\SchoolProfileApiController;
use App\Http\Controllers\Api\TourApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Auth Routes (Public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public School Directory & Discovery
Route::get('/home', [SchoolApiController::class, 'home']);
Route::get('/schools', [SchoolApiController::class, 'index']);
Route::get('/schools/compare', [SchoolApiController::class, 'compare']);
Route::get('/schools/nearby', [SchoolApiController::class, 'nearby']);
Route::get('/schools/{slug}', [SchoolApiController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated API Routes (Sanctum SPA Session / Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Current User & Logout
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Unified Role Dashboard
    Route::get('/dashboard', [DashboardApiController::class, 'index']);

    // School Reviews
    Route::post('/schools/{school}/reviews', [ReviewApiController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewApiController::class, 'destroy']);

    // Campus Tours
    Route::post('/schools/{school}/tours', [TourApiController::class, 'store']);
    Route::patch('/tours/{tourRequest}/status', [TourApiController::class, 'updateStatus']);

    // School Representative Profile
    Route::get('/school-profile', [SchoolProfileApiController::class, 'show']);
    Route::post('/school-profile', [SchoolProfileApiController::class, 'update']);

    // Profile Settings
    Route::get('/profile', [ProfileApiController::class, 'show']);
    Route::patch('/profile', [ProfileApiController::class, 'update']);
    Route::delete('/profile', [ProfileApiController::class, 'destroy']);

    // Administrator Moderation
    Route::post('/admin/listings/{listing}/approve', [AdminApiController::class, 'approveListing']);
    Route::post('/admin/listings/{listing}/reject', [AdminApiController::class, 'rejectListing']);
    Route::patch('/admin/users/{user}/role', [AdminApiController::class, 'updateUserRole']);
    Route::delete('/admin/reviews/{review}', [AdminApiController::class, 'deleteReview']);
});
