<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Review;
use App\Models\School;
use App\Models\TourRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with roles, schools, reviews, listings, and tours.
     */
    public function run(): void
    {
        // 1. Create Administrator
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@schoolfinder.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '+234 801 000 0001',
            'address' => 'Ministry of Education Road, Central District',
        ]);

        // 2. Create Parents
        $parent1 = User::create([
            'name' => 'Dr. Michael Adeyemi',
            'email' => 'parent@example.com',
            'password' => Hash::make('password123'),
            'role' => 'parent',
            'phone' => '+234 802 111 2233',
            'address' => '15 Admiralty Way, Lekki Phase 1',
        ]);

        $parent2 = User::create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password123'),
            'role' => 'parent',
            'phone' => '+234 803 444 5566',
            'address' => '8 Bourdillon Road, Ikoyi',
        ]);

        // 3. Create School Representatives
        $schoolUser1 = User::create([
            'name' => 'Green Valley Academy Admin',
            'email' => 'principal@greenvalley.com',
            'password' => Hash::make('password123'),
            'role' => 'school',
            'phone' => '+234 809 777 8899',
            'address' => 'Green Valley Campus, Victoria Island',
        ]);

        $schoolUser2 = User::create([
            'name' => 'St. Marks College Admin',
            'email' => 'contact@stmarks.edu',
            'password' => Hash::make('password123'),
            'role' => 'school',
            'phone' => '+234 808 666 5544',
            'address' => 'St. Marks Estate, Ikeja GRA',
        ]);

        // 4. Seed Schools Dataset
        $schoolsData = [
            [
                'user_id' => $schoolUser1->id,
                'name' => 'Green Valley International Academy',
                'slug' => 'green-valley-international-academy',
                'location' => 'Victoria Island, Lagos',
                'address' => 'Plot 14, Bishop Oluwole Street, Victoria Island',
                'latitude' => 6.4281,
                'longitude' => 3.4219,
                'fees' => 1250000,
                'ownership' => 'Private',
                'educational_level' => 'K-12',
                'residential_status' => 'Day',
                'educational_system' => 'British',
                'description' => 'A premier world-class institution dedicated to holistic education, science laboratories, Olympic swimming pool, and STEM-focused enrichment programs from preschool to A-Levels.',
                'contact_email' => 'admissions@greenvalley.edu.ng',
                'contact_phone' => '+234 1 234 5678',
                'website' => 'https://greenvalley.example.com',
                'admission_status' => 'Open',
                'featured_image' => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'approved',
            ],
            [
                'user_id' => $schoolUser2->id,
                'name' => 'St. Marks Comprehensive College',
                'slug' => 'st-marks-comprehensive-college',
                'location' => 'Ikeja GRA, Lagos',
                'address' => '22 Isaac John Street, GRA Ikeja',
                'latitude' => 6.5922,
                'longitude' => 3.3563,
                'fees' => 750000,
                'ownership' => 'Mission',
                'educational_level' => 'Secondary',
                'residential_status' => 'Boarding',
                'educational_system' => 'National',
                'description' => 'Renowned for exceptional discipline, moral integrity, and consistently outstanding WASSCE & NECO academic track records with boarding hostels.',
                'contact_email' => 'info@stmarkscollege.org',
                'contact_phone' => '+234 1 876 5432',
                'website' => 'https://stmarkscollege.example.org',
                'admission_status' => 'Open',
                'featured_image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'approved',
            ],
            [
                'user_id' => null,
                'name' => 'Horizon Montessori Early Learning Centre',
                'slug' => 'horizon-montessori-early-learning',
                'location' => 'Lekki Phase 1, Lagos',
                'address' => 'Block 5, Admiralty Way, Lekki Phase 1',
                'latitude' => 6.4474,
                'longitude' => 3.4731,
                'fees' => 600000,
                'ownership' => 'Private',
                'educational_level' => 'Nursery',
                'residential_status' => 'Day',
                'educational_system' => 'Montessori',
                'description' => 'Child-centered exploratory early childhood development incorporating sensory-based learning, bilingual speech development, and safe modern play arenas.',
                'contact_email' => 'enquiries@horizonmontessori.org',
                'contact_phone' => '+234 802 333 4455',
                'website' => 'https://horizonmontessori.example.org',
                'admission_status' => 'Open',
                'featured_image' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'approved',
            ],
            [
                'user_id' => null,
                'name' => 'Federal Government Model College',
                'slug' => 'federal-government-model-college',
                'location' => 'Yaba, Lagos',
                'address' => 'Commercial Avenue, Sabo, Yaba',
                'latitude' => 6.5167,
                'longitude' => 3.3833,
                'fees' => 120000,
                'ownership' => 'Public',
                'educational_level' => 'Secondary',
                'residential_status' => 'Day & Boarding',
                'educational_system' => 'National',
                'description' => 'Public model institution with heavily subsidized tuition fees, seasoned civil service educators, broad vocational training, and expansive sports complexes.',
                'contact_email' => 'fgmc-yaba@education.gov.ng',
                'contact_phone' => '+234 1 456 7890',
                'website' => 'https://fgmc.example.gov.ng',
                'admission_status' => 'In Progress',
                'featured_image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'approved',
            ],
            [
                'user_id' => null,
                'name' => 'The American International Crestview School',
                'slug' => 'the-american-international-crestview-school',
                'location' => 'Ikoyi, Lagos',
                'address' => '10 Kingsway Road, Ikoyi',
                'latitude' => 6.4531,
                'longitude' => 3.4358,
                'fees' => 3200000,
                'ownership' => 'Private',
                'educational_level' => 'K-12',
                'residential_status' => 'Day',
                'educational_system' => 'American',
                'description' => 'Accredited US High School Diploma curriculum and Advanced Placement (AP) coursework with state-of-the-art digital infrastructure and college guidance counseling.',
                'contact_email' => 'admissions@crestviewamerican.com',
                'contact_phone' => '+234 1 900 1234',
                'website' => 'https://crestviewamerican.example.com',
                'admission_status' => 'Open',
                'featured_image' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'approved',
            ],
            [
                'user_id' => null,
                'name' => 'Apex High School of Technology',
                'slug' => 'apex-high-school-of-technology',
                'location' => 'Surulere, Lagos',
                'address' => '45 Adeniran Ogunsanya Street, Surulere',
                'latitude' => 6.4969,
                'longitude' => 3.3533,
                'fees' => 480000,
                'ownership' => 'Private',
                'educational_level' => 'Secondary',
                'residential_status' => 'Day',
                'educational_system' => 'National',
                'description' => 'Focused on modern computing, robotics, coding bootcamps, alongside the national curriculum to prepare young learners for future digital professions.',
                'contact_email' => 'info@apextechschool.ng',
                'contact_phone' => '+234 812 345 6789',
                'website' => 'https://apextechschool.example.ng',
                'admission_status' => 'Closed',
                'featured_image' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
                'listing_status' => 'pending',
            ],
        ];

        foreach ($schoolsData as $data) {
            $listingStatus = $data['listing_status'];
            unset($data['listing_status']);

            $school = School::create($data);

            Listing::create([
                'school_id' => $school->id,
                'status' => $listingStatus,
                'approved_by' => $listingStatus === 'approved' ? $admin->id : null,
                'reviewed_at' => $listingStatus === 'approved' ? now() : null,
            ]);

            // Add reviews to approved schools
            if ($school->slug === 'green-valley-international-academy') {
                Review::create([
                    'user_id' => $parent1->id,
                    'school_id' => $school->id,
                    'rating' => 5,
                    'comment' => 'Exceptional facilities and caring teachers. My twins made tremendous progress in their reading and mathematics within just two terms.',
                ]);
                Review::create([
                    'user_id' => $parent2->id,
                    'school_id' => $school->id,
                    'rating' => 4,
                    'comment' => 'Great British curriculum integration and extracurricular activities. The fees are on the higher side, but the quality matches the cost.',
                ]);

                TourRequest::create([
                    'user_id' => $parent1->id,
                    'school_id' => $school->id,
                    'preferred_date' => now()->addDays(5)->toDateString(),
                    'time_slot' => 'Morning (10:00 AM)',
                    'student_name' => 'Daniel Adeyemi',
                    'student_grade' => 'Year 7',
                    'notes' => 'Would love to inspect the science laboratories and sports facilities.',
                    'status' => 'confirmed',
                ]);
            }

            if ($school->slug === 'st-marks-comprehensive-college') {
                Review::create([
                    'user_id' => $parent2->id,
                    'school_id' => $school->id,
                    'rating' => 5,
                    'comment' => 'The moral discipline and academic standards here are top notch. Excellent boarding environment with dedicated housemasters.',
                ]);

                TourRequest::create([
                    'user_id' => $parent2->id,
                    'school_id' => $school->id,
                    'preferred_date' => now()->addDays(7)->toDateString(),
                    'time_slot' => 'Afternoon (2:00 PM)',
                    'student_name' => 'Jessica Jenkins',
                    'student_grade' => 'JSS 1',
                    'notes' => 'Looking into boarding arrangements for next term.',
                    'status' => 'pending',
                ]);
            }

            // Sync rating cache
            $school->updateRatingCache();
        }

        // 5. Seed Kano & Northern Nigeria Schools
        $this->call(KanoSchoolsSeeder::class);

        $this->command->info('');
        $this->command->info(' ✨ HAJIYA RUKYS DATA SEEDING COMPLETE ✨');
        $this->command->info(' ----------------------------------------------------');
        $this->command->info('  All Nigeria & Kano schools, reviews, listings & demo users seeded.');
        $this->command->info('  Admin:      admin@schoolfinder.com (password123)');
        $this->command->info('  Parent:     parent@example.com (password123)');
        $this->command->info('  School Rep: principal@greenvalley.com (password123)');
        $this->command->info(' ----------------------------------------------------');
        $this->command->info('');
    }
}
