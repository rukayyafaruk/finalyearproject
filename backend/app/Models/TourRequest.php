<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_id',
        'preferred_date',
        'time_slot',
        'student_name',
        'student_grade',
        'notes',
        'status',
    ];

    protected $casts = [
        'preferred_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
