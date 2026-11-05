<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use App\Permission;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'email_verified_at', 'password', 'role', 'permissions', 'password_changed_at', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function sendPasswordResetNotification($token): void
    {
        $this->notify((new ResetPasswordNotification($token))->afterCommit());
    }

    public function hasPermission(Permission|string $permission): bool
    {
        $value = $permission instanceof Permission ? $permission->value : $permission;

        return $this->role === 'administrator' || in_array($value, $this->permissions ?? [], true);
    }

    /** @return list<string> */
    public function effectivePermissions(): array
    {
        if ($this->role === 'administrator') {
            return array_column(Permission::cases(), 'value');
        }

        if ($this->role === 'super_user') {
            return [Permission::ManageProfile->value];
        }

        return array_values(array_intersect(
            $this->permissions ?? [],
            array_column(Permission::cases(), 'value'),
        ));
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'array',
            'password_changed_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }
}
