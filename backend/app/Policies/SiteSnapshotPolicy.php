<?php

namespace App\Policies;

use App\Models\SiteSnapshot;
use App\Models\User;

class SiteSnapshotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('content.manage') || $user->hasPermission('settings.manage');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SiteSnapshot $siteSnapshot): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SiteSnapshot $siteSnapshot): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SiteSnapshot $siteSnapshot): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SiteSnapshot $siteSnapshot): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SiteSnapshot $siteSnapshot): bool
    {
        return false;
    }
}
