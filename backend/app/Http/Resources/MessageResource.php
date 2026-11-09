<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->name,
            'email' => $this->email,
            'service' => $this->subject,
            'timeline' => $this->timeline,
            'body' => $this->body,
            'createdAt' => $this->created_at?->toISOString(),
            'unread' => $this->read_at === null,
            'replySubject' => $this->reply_subject,
            'replyBody' => $this->reply_body,
            'repliedAt' => $this->replied_at?->toISOString(),
        ];
    }
}
