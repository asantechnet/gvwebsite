<?php

namespace App\Policies;

use App\Models\ContentRecord;
use App\Models\User;

class ContentRecordPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('content.manage');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ContentRecord $contentRecord): bool
    {
        return $user->hasPermission('content.manage');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('content.manage');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ContentRecord $contentRecord): bool
    {
        return $user->hasPermission('content.manage');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ContentRecord $contentRecord): bool
    {
        return $user->hasPermission('content.manage');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ContentRecord $contentRecord): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ContentRecord $contentRecord): bool
    {
        return false;
    }
}
