<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Review;
use App\Models\School;
use App\Models\TourRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KanoSchoolsSeeder extends Seeder
{
    /**
     * Seed schools from Kano and Northern Nigeria.
     */
    public function run(): void
    {
        // Get or create admin for approvals
        $admin = User::where('role', 'admin')->first();

        // Create Kano-based school representatives
        $kanoSchoolUser1 = User::firstOrCreate(
            ['email' => 'admin@bayeroschool.edu.ng'],
            [
                'name'     => 'Bayero Royal School Admin',
                'password' => Hash::make('password123'),
                'role'     => 'school',
                'phone'    => '+234 803 900 1122',
                'address'  => 'Emir Road, Kano Municipal',
            ]
        );

        $kanoSchoolUser2 = User::firstOrCreate(
            ['email' => 'admin@nasarawaacademy.edu.ng'],
            [
                'name'     => 'Nasarawa Academy Admin',
                'password' => Hash::make('password123'),
                'role'     => 'school',
                'phone'    => '+234 806 500 7788',
                'address'  => 'Nasarawa GRA, Kano',
            ]
        );

        // Create Kano-based parent reviewers
        $kanoParent1 = User::firstOrCreate(
            ['email' => 'alhaji.musa@example.com'],
            [
                'name'     => 'Alhaji Musa Dantata',
                'password' => Hash::make('password123'),
                'role'     => 'parent',
                'phone'    => '+234 811 223 3344',
                'address'  => '12 Zaria Road, Kano',
            ]
        );

        $kanoParent2 = User::firstOrCreate(
            ['email' => 'hajiya.aisha@example.com'],
            [
                'name'     => 'Hajiya Aisha Gwandu',
                'password' => Hash::make('password123'),
                'role'     => 'parent',
                'phone'    => '+234 807 334 5566',
                'address'  => 'Nassarawa GRA, Kano',
            ]
        );

        $schoolsData = [
            // ── 1. Bayero Royal Academy ──────────────────────────────────
            [
                'user_id'            => $kanoSchoolUser1->id,
                'name'               => 'Bayero Royal Academy',
                'slug'               => 'bayero-royal-academy-kano',
                'location'           => 'Kano Municipal, Kano State',
                'address'            => 'Emir Road, Kano Municipal LGA, Kano',
                'latitude'           => 12.0022,
                'longitude'          => 8.5920,
                'fees'               => 380000,
                'ownership'          => 'Private',
                'educational_level'  => 'K-12',
                'residential_status' => 'Day & Boarding',
                'educational_system' => 'National',
                'description'        => 'One of Kano\'s most prestigious private schools, blending rigorous national curriculum standards with strong Islamic moral values, Arabic language instruction, and modern STEM facilities. Former students consistently achieve top WAEC results.',
                'contact_email'      => 'admissions@bayeroacademy.edu.ng',
                'contact_phone'      => '+234 803 900 1122',
                'website'            => 'https://bayeroacademy.example.edu.ng',
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent1,
                        'rating'  => 5,
                        'comment' => 'Excellent school with strong academic values and good moral upbringing. My son graduated last year and secured admission to ABU Zaria. Highly recommended for Kano families.',
                    ],
                    [
                        'user'    => $kanoParent2,
                        'rating'  => 4,
                        'comment' => 'Very disciplined environment. Teachers are experienced and attentive. The boarding facilities are clean and well-monitored.',
                    ],
                ],
            ],

            // ── 2. Nasarawa International School ─────────────────────────
            [
                'user_id'            => $kanoSchoolUser2->id,
                'name'               => 'Nasarawa International School',
                'slug'               => 'nasarawa-international-school-kano',
                'location'           => 'Nasarawa GRA, Kano State',
                'address'            => 'Plot 7, Ado Bayero Avenue, Nasarawa GRA, Kano',
                'latitude'           => 12.0156,
                'longitude'          => 8.5319,
                'fees'               => 620000,
                'ownership'          => 'Private',
                'educational_level'  => 'K-12',
                'residential_status' => 'Day',
                'educational_system' => 'British',
                'description'        => 'Premier British-curriculum institution in Northern Nigeria offering Cambridge IGCSE and A-Level pathways. Known for exceptional science, technology, and arts departments with highly qualified expatriate and local faculty.',
                'contact_email'      => 'enquiries@nasarawaschool.edu.ng',
                'contact_phone'      => '+234 806 500 7788',
                'website'            => 'https://nasarawaschool.example.edu.ng',
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent2,
                        'rating'  => 5,
                        'comment' => 'The British curriculum here is world-class. My daughter is now at University of Birmingham after completing her A-Levels here. Worth every naira.',
                    ],
                ],
            ],

            // ── 3. Government Secondary School Kofar Ruwa ────────────────
            [
                'user_id'            => null,
                'name'               => 'Government Secondary School Kofar Ruwa',
                'slug'               => 'government-secondary-school-kofar-ruwa',
                'location'           => 'Kofar Ruwa, Kano State',
                'address'            => 'Kofar Ruwa Quarters, Kano Municipal LGA',
                'latitude'           => 11.9975,
                'longitude'          => 8.5131,
                'fees'               => 45000,
                'ownership'          => 'Public',
                'educational_level'  => 'Secondary',
                'residential_status' => 'Day',
                'educational_system' => 'National',
                'description'        => 'A government-owned secondary school with a long heritage of producing Kano State\'s finest civil servants, academics, and professionals. Supported by the state ministry with qualified teachers and renovated classrooms.',
                'contact_email'      => 'gsskofar@kanoedu.gov.ng',
                'contact_phone'      => '+234 064 660 0011',
                'website'            => null,
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent1,
                        'rating'  => 4,
                        'comment' => 'Good teachers and affordable fees. My children got solid WAEC results. The school could use better infrastructure but academics are strong.',
                    ],
                ],
            ],

            // ── 4. Sunrise Montessori School Kano ────────────────────────
            [
                'user_id'            => null,
                'name'               => 'Sunrise Montessori School Kano',
                'slug'               => 'sunrise-montessori-school-kano',
                'location'           => 'Tarauni, Kano State',
                'address'            => '5 Tarauni Ring Road, Tarauni LGA, Kano',
                'latitude'           => 12.0387,
                'longitude'          => 8.5672,
                'fees'               => 290000,
                'ownership'          => 'Private',
                'educational_level'  => 'Nursery',
                'residential_status' => 'Day',
                'educational_system' => 'Montessori',
                'description'        => 'Kano\'s leading Montessori early-years centre providing child-led exploratory learning, bilingual Hausa-English instruction, sensory play, and creative arts for children aged 18 months to 6 years.',
                'contact_email'      => 'info@sunrisemontessori-kano.ng',
                'contact_phone'      => '+234 802 456 7890',
                'website'            => 'https://sunrisemontessori-kano.example.ng',
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent2,
                        'rating'  => 5,
                        'comment' => 'My daughter started here at age 2. She is now reading and counting beautifully at age 4. The teachers are so patient and loving. Best nursery in Kano.',
                    ],
                ],
            ],

            // ── 5. Federal Government College Kano ───────────────────────
            [
                'user_id'            => null,
                'name'               => 'Federal Government College Kano',
                'slug'               => 'federal-government-college-kano',
                'location'           => 'Dutse Alhaji, Kano State',
                'address'            => 'Dutse Alhaji District, Kano Municipal LGA',
                'latitude'           => 12.0469,
                'longitude'          => 8.4965,
                'fees'               => 95000,
                'ownership'          => 'Public',
                'educational_level'  => 'Secondary',
                'residential_status' => 'Boarding',
                'educational_system' => 'National',
                'description'        => 'A prestigious federal unity school with fully integrated boarding facilities. Known nationally for its academic rigour, sports champions, and a long roll call of distinguished alumni in government and academia.',
                'contact_email'      => 'fgckano@education.gov.ng',
                'contact_phone'      => '+234 064 880 0022',
                'website'            => 'https://fgckano.example.gov.ng',
                'admission_status'   => 'In Progress',
                'featured_image'     => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent1,
                        'rating'  => 5,
                        'comment' => 'FGC Kano shaped my son\'s character and academic discipline. The boarding life builds independence and the teachers are passionate. Highly recommend applying early.',
                    ],
                ],
            ],

            // ── 6. Al-Furqan Islamic & Science Academy ────────────────────
            [
                'user_id'            => null,
                'name'               => 'Al-Furqan Islamic & Science Academy',
                'slug'               => 'al-furqan-islamic-science-academy-kano',
                'location'           => 'Fagge, Kano State',
                'address'            => 'Fagge District, Kano Municipal LGA',
                'latitude'           => 12.0080,
                'longitude'          => 8.5213,
                'fees'               => 220000,
                'ownership'          => 'Mission',
                'educational_level'  => 'K-12',
                'residential_status' => 'Day & Boarding',
                'educational_system' => 'National',
                'description'        => 'An integrated Islamic and secular school combining comprehensive Quranic memorisation (Hifz), Arabic language studies, and full national curriculum subjects including sciences, mathematics, and English language.',
                'contact_email'      => 'info@alfurqanacademy.edu.ng',
                'contact_phone'      => '+234 805 112 2334',
                'website'            => null,
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent2,
                        'rating'  => 5,
                        'comment' => 'Perfect balance between Quran and academics. My son memorised the Quran and still had excellent WAEC results. This is the school for any serious Muslim family.',
                    ],
                    [
                        'user'    => $kanoParent1,
                        'rating'  => 4,
                        'comment' => 'Very good school with strong Islamic values and decent science labs. The boarding arrangement is well supervised. I recommend this school to every parent in Kano.',
                    ],
                ],
            ],

            // ── 7. Aminu Kano Model Primary School ───────────────────────
            [
                'user_id'            => null,
                'name'               => 'Aminu Kano Model Primary School',
                'slug'               => 'aminu-kano-model-primary-school',
                'location'           => 'Gwale, Kano State',
                'address'            => 'Gwale LGA, Kano State',
                'latitude'           => 11.9969,
                'longitude'          => 8.5390,
                'fees'               => 80000,
                'ownership'          => 'Public',
                'educational_level'  => 'Primary',
                'residential_status' => 'Day',
                'educational_system' => 'National',
                'description'        => 'Named after the great Northern reformer Aminu Kano, this model school offers enhanced primary education with upgraded classrooms, trained pedagogical staff, and free feeding schemes under the state government.',
                'contact_email'      => 'aminukanoschool@kanoedu.gov.ng',
                'contact_phone'      => '+234 064 770 0033',
                'website'            => null,
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [],
            ],

            // ── 8. Pinnacle International School Kaduna ───────────────────
            [
                'user_id'            => null,
                'name'               => 'Pinnacle International School Kaduna',
                'slug'               => 'pinnacle-international-school-kaduna',
                'location'           => 'Barnawa, Kaduna State',
                'address'            => 'Barnawa Housing Estate, Kaduna South LGA',
                'latitude'           => 10.4806,
                'longitude'          => 7.4294,
                'fees'               => 510000,
                'ownership'          => 'Private',
                'educational_level'  => 'K-12',
                'residential_status' => 'Day & Boarding',
                'educational_system' => 'British',
                'description'        => 'Northern Nigeria\'s foremost British curriculum school outside Kano, offering Cambridge Primary, IGCSE, and A-Level programmes with a dedicated arts & music department, state-of-the-art ICT labs, and an indoor sports complex.',
                'contact_email'      => 'admissions@pinnaclekaduna.edu.ng',
                'contact_phone'      => '+234 062 240 0055',
                'website'            => 'https://pinnaclekaduna.example.edu.ng',
                'admission_status'   => 'Open',
                'featured_image'     => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
                'listing_status'     => 'approved',
                'reviews'            => [
                    [
                        'user'    => $kanoParent1,
                        'rating'  => 5,
                        'comment' => 'We relocated from Kano specifically to enrol our children here. The Cambridge programme is outstanding and teachers really care about student progress.',
                    ],
                ],
            ],
        ];

        foreach ($schoolsData as $data) {
            $reviews      = $data['reviews'];
            $listingStatus = $data['listing_status'];
            unset($data['reviews'], $data['listing_status']);

            // Skip if school already exists
            if (School::where('slug', $data['slug'])->exists()) {
                continue;
            }

            $school = School::create($data);

            Listing::create([
                'school_id'   => $school->id,
                'status'      => $listingStatus,
                'approved_by' => $listingStatus === 'approved' ? ($admin?->id) : null,
                'reviewed_at' => $listingStatus === 'approved' ? now() : null,
            ]);

            foreach ($reviews as $review) {
                Review::create([
                    'user_id'   => $review['user']->id,
                    'school_id' => $school->id,
                    'rating'    => $review['rating'],
                    'comment'   => $review['comment'],
                ]);
            }

            $school->updateRatingCache();
        }

        $this->command->info('✅ Kano & Northern Nigeria schools seeded successfully (' . count($schoolsData) . ' schools).');
    }
}
