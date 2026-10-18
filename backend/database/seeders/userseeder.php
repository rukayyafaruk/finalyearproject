<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@yopmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('myadminpassword'),
                'role' => 'admin',
                'phone' => '08054718899',
                'address' => 'greenwich avenue abia kano',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Marigold school',
                'email' => 'marigoldschools@schoolsmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('marigoldschoolpassword'),
                'role' => 'school',
                'phone' => '08051998602',
                'address' => '12 marylane apapa estate Abuja',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ahmad Mustapha',
                'email' => 'ahmadmustaphat@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('ahmadmustaphapassword'),
                'role' => 'parent',
                'phone' => '08009105723',
                'address' => '5 fantastic street fifth avenue katsina',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}