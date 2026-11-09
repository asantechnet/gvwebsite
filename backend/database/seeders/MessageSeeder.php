<?php

namespace Database\Seeders;

use App\Models\Message;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'احمد رضایی',
                'email' => 'ahmad@example.com',
                'subject' => 'مشاوره تحصیلی',
                'timeline' => '۳ تا ۶ ماه آینده',
                'body' => 'سلام، برای انتخاب دانشگاه و آماده‌سازی مدارک پذیرش به راهنمایی نیاز دارم.',
                'created_at' => '2026-11-04T08:30:00Z',
                'unread' => true,
            ],
            [
                'name' => 'مریم احمدی',
                'email' => 'maryam@example.com',
                'subject' => 'بورسیه تحصیلی',
                'timeline' => 'سال تحصیلی آینده',
                'body' => 'لطفاً درباره بورسیه‌های مقطع کارشناسی ارشد و شرایط زبان معلومات بفرستید.',
                'created_at' => '2026-11-03T13:15:00Z',
                'unread' => true,
            ],
            [
                'name' => 'Farid Khan',
                'email' => 'farid@example.com',
                'subject' => 'Work visa consultation',
                'timeline' => null,
                'body' => 'I would like to understand the document requirements and expected processing timeline.',
                'created_at' => '2026-11-02T10:00:00Z',
                'unread' => false,
            ],
        ];

        foreach ($messages as $message) {
            $createdAt = CarbonImmutable::parse($message['created_at']);

            Message::query()->firstOrCreate(
                ['email' => $message['email'], 'created_at' => $createdAt],
                [
                    'name' => $message['name'],
                    'subject' => $message['subject'],
                    'timeline' => $message['timeline'],
                    'body' => $message['body'],
                    'read_at' => $message['unread'] ? null : $createdAt,
                    'updated_at' => $createdAt,
                ],
            );
        }
    }
}
