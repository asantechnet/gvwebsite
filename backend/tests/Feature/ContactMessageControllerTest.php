<?php

namespace Tests\Feature;

use App\Notifications\ContactMessageReceived;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ContactMessageControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_public_visitor_can_submit_a_contact_message(): void
    {
        Notification::fake();
        config(['globalvision.contact_notification_email' => 'inbox@example.com']);

        $response = $this->postJson('/api/contact/messages', [
            'name' => 'Amina Rahimi',
            'email' => 'AMINA@example.com',
            'subject' => 'Study consultation',
            'timeline' => 'Within three months',
            'message' => 'I would like to discuss available study options.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.received', true)
            ->assertJsonMissingPath('data.body');

        $this->assertDatabaseHas('messages', [
            'email' => 'amina@example.com',
            'subject' => 'Study consultation',
            'read_at' => null,
        ]);
        Notification::assertSentOnDemand(ContactMessageReceived::class);
    }

    public function test_contact_submission_is_validated(): void
    {
        $this->postJson('/api/contact/messages', [
            'name' => 'A',
            'email' => 'invalid',
            'subject' => '',
            'message' => 'short',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }
}
