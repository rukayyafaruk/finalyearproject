<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (Backend API Root)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'app' => 'Rukys Portal Backend API',
        'status' => 'online',
        'version' => '1.0.0',
        'api_documentation' => [
            'endpoints_prefix' => '/api',
            'health_check' => '/up',
            'sanctum_csrf' => '/sanctum/csrf-cookie',
        ],
        'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),
    ]);
});
