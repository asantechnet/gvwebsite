<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
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
            'action' => $this->action,
            'actor' => $this->whenLoaded('actor', fn (): ?array => $this->actor ? [
                'id' => (string) $this->actor->id,
                'name' => $this->actor->name,
            ] : null),
            'metadata' => $this->metadata ?? (object) [],
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
