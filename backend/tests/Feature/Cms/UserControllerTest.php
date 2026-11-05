<?php

namespace Tests\Feature\Cms;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_super_user_can_create_administrator_without_mass_assigning_role(): void
    {
        $owner = User::factory()->create(['role' => 'super_user', 'password' => Hash::make('OwnerPassword1!')]);

        $response = $this->actingAs($owner)->postJson('/api/cms/users', [
            'name' => "Robert'); DROP TABLE users;--", 'email' => 'NEW.ADMIN@example.com',
            'password' => 'Administrator1!', 'password_confirmation' => 'Administrator1!',
            'currentPassword' => 'OwnerPassword1!', 'role' => 'super_user', 'permissions' => ['settings.manage'],
        ]);

        $response->assertCreated()->assertJsonPath('data.role', 'administrator')->assertJsonMissingPath('data.password');
        $this->assertDatabaseHas('users', ['name' => "Robert'); DROP TABLE users;--", 'email' => 'new.admin@example.com', 'role' => 'administrator', 'permissions' => null]);
        $this->assertDatabaseHas('audit_logs', ['actor_id' => $owner->id, 'action' => 'user.created']);
    }

    public function test_returns_403_when_administrator_attempts_user_management(): void
    {
        $administrator = User::factory()->create(['role' => 'administrator']);

        $this->actingAs($administrator)->getJson('/api/cms/users')->assertForbidden();
    }

    public function test_returns_422_when_current_password_is_wrong(): void
    {
        $owner = User::factory()->create(['role' => 'super_user', 'password' => Hash::make('OwnerPassword1!')]);

        $this->actingAs($owner)->postJson('/api/cms/users', [
            'name' => 'Administrator', 'email' => 'admin@example.com', 'password' => 'Administrator1!',
            'password_confirmation' => 'Administrator1!', 'currentPassword' => 'wrong-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('currentPassword');

        $this->assertDatabaseMissing('users', ['email' => 'admin@example.com']);
    }

    public function test_super_user_cannot_delete_super_user_account(): void
    {
        $owner = User::factory()->create(['role' => 'super_user', 'password' => Hash::make('OwnerPassword1!')]);

        $this->actingAs($owner)->deleteJson("/api/cms/users/{$owner->id}", ['currentPassword' => 'OwnerPassword1!'])->assertForbidden();

        $this->assertModelExists($owner);
    }

    public function test_password_update_revokes_target_sessions(): void
    {
        $owner = User::factory()->create(['role' => 'super_user', 'password' => Hash::make('OwnerPassword1!')]);
        $administrator = User::factory()->create(['role' => 'administrator']);
        $this->app['db']->table('sessions')->insert(['id' => 'target-session', 'user_id' => $administrator->id, 'ip_address' => '127.0.0.1', 'user_agent' => 'test', 'payload' => 'payload', 'last_activity' => time()]);

        $this->actingAs($owner)->putJson("/api/cms/users/{$administrator->id}", [
            'password' => 'ReplacementPassword1!', 'password_confirmation' => 'ReplacementPassword1!', 'currentPassword' => 'OwnerPassword1!',
        ])->assertOk();

        $this->assertTrue(Hash::check('ReplacementPassword1!', $administrator->fresh()->password));
        $this->assertDatabaseMissing('sessions', ['user_id' => $administrator->id]);
    }

    public function test_super_user_can_send_password_reset_to_administrator(): void
    {
        Notification::fake();
        $owner = User::factory()->create(['role' => 'super_user', 'password' => Hash::make('OwnerPassword1!')]);
        $administrator = User::factory()->create(['role' => 'administrator']);

        $this->actingAs($owner)->postJson("/api/cms/users/{$administrator->id}/password-reset", ['currentPassword' => 'OwnerPassword1!'])->assertOk();

        Notification::assertSentTo($administrator, ResetPasswordNotification::class);
    }
}
