<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\ConfirmPrivilegedActionRequest;
use App\Http\Requests\Cms\StoreUserRequest;
use App\Http\Requests\Cms\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);

        return UserResource::collection(User::query()->oldest('id')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::query()->create([
            ...$request->safe()->only(['name', 'email']),
            'password' => Hash::make($request->validated('password')),
            'role' => 'administrator',
            'permissions' => null,
            'email_verified_at' => now(),
            'password_changed_at' => now(),
        ]);
        $this->audit($request, $user, 'user.created');

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): UserResource
    {
        $this->authorize('view', $user);

        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $attributes = $request->safe()->only(['name', 'email']);
        if ($request->filled('password')) {
            $attributes['password'] = Hash::make($request->validated('password'));
            $attributes['password_changed_at'] = now();
        }

        DB::transaction(function () use ($attributes, $user): void {
            $user->update($attributes);
            if (array_key_exists('password', $attributes)) {
                DB::table('sessions')->where('user_id', $user->id)->delete();
            }
        });
        $this->audit($request, $user, 'user.updated', ['fields' => array_keys($attributes)]);

        return new UserResource($user->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConfirmPrivilegedActionRequest $request, User $user): JsonResponse
    {
        $this->authorize('delete', $user);
        $this->audit($request, $user, 'user.deleted', ['email' => $user->email]);
        $user->delete();

        return response()->json(null, 204);
    }

    public function sendPasswordReset(ConfirmPrivilegedActionRequest $request, User $user): JsonResponse
    {
        $status = Password::sendResetLink(['email' => $user->email]);
        if ($status !== Password::ResetLinkSent) {
            return response()->json(['message' => __($status)], 422);
        }

        $this->audit($request, $user, 'user.password_reset_requested');

        return response()->json(['message' => 'Password reset link sent.']);
    }

    /** @param array<string, mixed> $metadata */
    private function audit(ConfirmPrivilegedActionRequest|StoreUserRequest|UpdateUserRequest $request, User $user, string $action, array $metadata = []): void
    {
        AuditLog::query()->create([
            'actor_id' => $request->user()->id,
            'action' => $action,
            'auditable_type' => $user->getMorphClass(),
            'auditable_id' => $user->id,
            'metadata' => $metadata,
            'ip_address' => $request->ip(),
        ]);
    }
}
