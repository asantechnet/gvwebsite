<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $token) {}

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
            ->subject('Reset your Global Vision CMS password')
            ->line('A password reset was requested for your CMS account.')
            ->action('Reset password', rtrim(config('globalvision.frontend_url'), '/')
                .'/dashboard/reset-password?token='.urlencode($this->token)
                .'&email='.urlencode($notifiable->getEmailForPasswordReset()))
            ->line('If you did not request this reset, no action is required.');
    }
}
