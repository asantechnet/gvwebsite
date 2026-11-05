<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_known_account_receives_queued_password_reset_notification(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email])
            ->assertAccepted()
            ->assertJsonPath('message', 'If an account matches that email, a password reset link has been sent.');

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_unknown_account_receives_same_accepted_response(): void
    {
        Notification::fake();

        $this->postJson('/api/auth/forgot-password', ['email' => 'missing@example.com'])
            ->assertAccepted()
            ->assertJsonPath('message', 'If an account matches that email, a password reset link has been sent.');

        Notification::assertNothingSent();
    }

    public function test_valid_token_resets_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old-secure-password')]);
        $token = Password::createToken($user);

        $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'New-secure-password1',
            'confirmPassword' => 'New-secure-password1',
        ])->assertOk();

        $this->assertTrue(Hash::check('New-secure-password1', $user->fresh()->password));
    }
}
