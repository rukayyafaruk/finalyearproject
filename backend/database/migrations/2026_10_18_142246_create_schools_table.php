<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_schools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('location');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('fees')->default(0);
            $table->string('ownership')->default('Private'); 
            $table->string('educational_level')->default('K-12'); 
            $table->string('residential_status')->default('Day'); 
            $table->string('educational_system')->default('National'); 
            $table->text('description')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('website')->nullable();
            $table->string('admission_status')->default('Open'); // Open, Closed, In Progress
            $table->string('featured_image')->nullable();
            $table->decimal('rating_cache', 3, 2)->default(0.00);
            $table->unsignedInteger('review_count_cache')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_schools');
    }
};