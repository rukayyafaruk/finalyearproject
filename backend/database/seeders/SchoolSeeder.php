<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        // Find the school user created by UserSeeder
        $schoolUserId = DB::table('users')
            ->where('email', 'school@example.com')
            ->value('id');

        DB::table('schools')->insert([
            [
                'user_id' => $schoolUserId,
                'name' => 'Shining bright International School',
                'slug' => 'shiningbright-international-school',
                'location' => 'Abuja',
                'address' => '54 ahmad talib road, Maitama, Abuja',
                'latitude' => 9.0820000,
                'longitude' => 7.4900000,
                'fees' => 1900000,
                'ownership' => 'Private',
                'educational_level' => 'K-12',
                'residential_status' => 'Day & Boarding',
                'educational_system' => 'British',
                'description' => 'A well-equipped international school offering the British curriculum.',
                'contact_email' => 'info@shiningbrightd.example.com',
                'contact_phone' => '08000000010',
                'website' => 'https://shiningbright.example.com',
                'admission_status' => 'Open',
                'featured_image' => null,
                'rating_cache' => 4.50,
                'review_count_cache' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => null,
                'name' => 'Unity Public Primary School',
                'slug' => 'unity-public-primary-school',
                'location' => 'Gwarinpa',
                'address' => 'Plot 4, Gwarinpa Estate, Abuja',
                'latitude' => 9.1080000,
                'longitude' => 7.4030000,
                'fees' => 0,
                'ownership' => 'Public',
                'educational_level' => 'Primary',
                'residential_status' => 'Day',
                'educational_system' => 'National',
                'description' => 'A government primary school following the national curriculum.',
                'contact_email' => null,
                'contact_phone' => null,
                'website' => null,
                'admission_status' => 'In Progress',
                'featured_image' => null,
                'rating_cache' => 3.80,
                'review_count_cache' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => null,
                'name' => 'St. Mary Mission Secondary School',
                'slug' => 'st-mary-mission-secondary-school',
                'location' => 'Garki',
                'address' => '8 Mission Close, Garki, Abuja',
                'latitude' => 9.0300000,
                'longitude' => 7.4900000,
                'fees' => 300000,
                'ownership' => 'Mission',
                'educational_level' => 'Secondary',
                'residential_status' => 'Boarding',
                'educational_system' => 'National',
                'description' => 'A mission-run secondary boarding school.',
                'contact_email' => 'admissions@stmary.example.com',
                'contact_phone' => '08000000011',
                'website' => null,
                'admission_status' => 'Closed',
                'featured_image' => null,
                'rating_cache' => 4.10,
                'review_count_cache' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}