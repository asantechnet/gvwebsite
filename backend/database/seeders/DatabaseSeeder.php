<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedAccount('super_user');
        $this->seedAccount('admin');
    }

    private function seedAccount(string $configuration): void
    {
        $email = config("globalvision.{$configuration}.email");
        $password = config("globalvision.{$configuration}.password");

        if (! $email || ! $password || mb_strlen($password) < 12) {
            $this->command?->warn("{$configuration} not seeded: configure an email and a password of at least 12 characters.");

            return;
        }

        User::query()->updateOrCreate(
            ['email' => mb_strtolower($email)],
            [
                'name' => config("globalvision.{$configuration}.name"),
                'password' => Hash::make($password),
                'role' => $configuration === 'super_user' ? 'super_user' : 'administrator',
                'permissions' => null,
            ],
        );
    }
}
