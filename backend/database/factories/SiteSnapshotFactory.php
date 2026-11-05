<?php

namespace Database\Factories;

use App\Models\SiteSnapshot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSnapshot>
 */
class SiteSnapshotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->randomElement(config('globalvision.snapshot_keys')),
            'payload' => ['value' => fake()->sentence()],
            'version' => 1,
            'updated_by' => null,
            'published_at' => now(),
        ];
    }
}
