<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_user_can_log_in_and_receive_normalized_session(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('a-strong-test-password'),
            'permissions' => ['dashboard.view'],
        ]);

        $response = $this->withHeader('Referer', 'http://localhost')
            ->postJson('/api/auth/login', [
                'email' => $user->email,
                'password' => 'a-strong-test-password',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.user.id', (string) $user->id)
            ->assertJsonPath('data.permissions.0', 'dashboard.view');
        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_credentials_are_rejected_without_disclosing_account_state(): void
    {
        User::factory()->create(['email' => 'editor@example.com']);

        $this->withHeader('Referer', 'http://localhost')
            ->postJson('/api/auth/login', [
                'email' => 'editor@example.com',
                'password' => 'incorrect-password',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_profile_manager_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-secure-password'),
            'permissions' => ['profile.manage'],
        ]);

        $this->actingAs($user)
            ->withHeader('Referer', 'http://localhost')
            ->withSession([])
            ->putJson('/api/auth/password', [
                'currentPassword' => 'old-secure-password',
                'password' => 'New-secure-password1',
                'confirmPassword' => 'New-secure-password1',
            ])
            ->assertOk();

        $this->assertTrue(Hash::check('New-secure-password1', $user->fresh()->password));
    }
}
