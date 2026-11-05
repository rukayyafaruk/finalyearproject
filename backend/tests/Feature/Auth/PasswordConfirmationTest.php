<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_confirmation_requires_authentication(): void
    {
        $this->postJson('/api/confirm-password')->assertUnauthorized();
    }

    public function test_password_can_be_confirmed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/confirm-password', [
            'password' => 'password',
        ]);

        $response->assertOk()->assertJsonPath('message', 'Password confirmed.');
        $this->assertNotNull(session('auth.password_confirmed_at'));
    }

    public function test_password_is_not_confirmed_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/confirm-password', [
            'password' => 'wrong-password',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('password');
    }
}
