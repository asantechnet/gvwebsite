<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Message $message) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New website enquiry: '.$this->message->subject)
            ->greeting('New Global Vision enquiry')
            ->line('Name: '.$this->message->name)
            ->line('Email: '.$this->message->email)
            ->line('Subject: '.$this->message->subject)
            ->line($this->message->body)
            ->action('Open message inbox', rtrim(config('globalvision.frontend_url'), '/').'/dashboard/messages');
    }
}
