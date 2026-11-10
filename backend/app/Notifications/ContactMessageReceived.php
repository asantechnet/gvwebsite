<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification
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
            ->replyTo($this->message->email, $this->message->name)
            ->view('emails.contact-message-received', [
                'messageRecord' => $this->message,
                'inboxUrl' => rtrim(config('globalvision.frontend_url'), '/').'/dashboard/messages',
            ]);
    }
}
