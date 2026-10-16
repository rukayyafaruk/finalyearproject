<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('location');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('fees')->default(0);
            $table->string('ownership')->default('Private'); // Public, Private, Mission
            $table->string('educational_level')->default('K-12'); // Nursery, Primary, Secondary, K-12
            $table->string('residential_status')->default('Day'); // Day, Boarding, Day & Boarding
            $table->string('educational_system')->default('National'); // British, American, National, Montessori, IB
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

        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 1 - 5
            $table->text('comment');
            $table->timestamps();

            $table->unique(['user_id', 'school_id']);
        });

        Schema::create('tour_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->date('preferred_date');
            $table->string('time_slot')->nullable(); // Morning, Afternoon
            $table->string('student_name')->nullable();
            $table->string('student_grade')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_requests');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('listings');
        Schema::dropIfExists('schools');
    }
};
