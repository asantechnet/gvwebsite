<?php

namespace Database\Factories;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'actor_id' => null,
            'action' => 'test.action',
            'auditable_type' => null,
            'auditable_id' => null,
            'metadata' => [],
            'ip_address' => fake()->ipv4(),
        ];
    }
}
