<?php

namespace Tests\Feature\Cms;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_message_manager_can_list_and_mark_messages_read(): void
    {
        $user = User::factory()->create(['permissions' => ['messages.manage']]);
        $message = Message::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/cms/messages')
            ->assertOk()
            ->assertJsonPath('data.0.id', (string) $message->id)
            ->assertJsonStructure(['data', 'links', 'meta']);

        $this->actingAs($user)
            ->patchJson("/api/cms/messages/{$message->id}", ['unread' => false])
            ->assertOk()
            ->assertJsonPath('data.unread', false);

        $this->assertNotNull($message->fresh()->read_at);
    }

    public function test_user_without_message_permission_is_forbidden(): void
    {
        $user = User::factory()->create(['permissions' => ['dashboard.view']]);
        $message = Message::factory()->create();

        $this->actingAs($user)->getJson('/api/cms/messages')->assertForbidden();
        $this->actingAs($user)
            ->deleteJson("/api/cms/messages/{$message->id}")
            ->assertForbidden();
    }
}
