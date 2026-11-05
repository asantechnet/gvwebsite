<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentRecordResource extends JsonResource
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
            'slug' => $this->slug,
            'type' => $this->type ?? '',
            'category' => $this->category ?? '',
            'status' => $this->status,
            'featured' => $this->featured,
            'image' => $this->image ?? '',
            'href' => $this->href ?? '',
            'translations' => $this->translations,
            'metadata' => $this->metadata ?? (object) [],
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
