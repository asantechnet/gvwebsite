<?php

namespace Database\Factories;

use App\Models\ContentRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContentRecord>
 */
class ContentRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'collection' => 'magazine',
            'slug' => fake()->unique()->slug(),
            'type' => 'post',
            'category' => fake()->word(),
            'status' => 'draft',
            'featured' => false,
            'image' => null,
            'href' => null,
            'translations' => collect(['prs', 'ps', 'en'])->mapWithKeys(fn (string $locale) => [
                $locale => [
                    'title' => fake()->sentence(4),
                    'excerpt' => fake()->sentence(),
                    'content' => '<p>'.fake()->paragraph().'</p>',
                    'tags' => [],
                    'seoTitle' => '',
                    'metaDescription' => '',
                    'imageAlt' => '',
                ],
            ])->all(),
            'metadata' => [],
        ];
    }
}
