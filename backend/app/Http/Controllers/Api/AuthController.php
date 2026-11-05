<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\SessionResource;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function session(Request $request): SessionResource
    {
        return new SessionResource($request->user());
    }

    public function login(LoginRequest $request): SessionResource
    {
        if (! Auth::attempt($request->safe()->only(['email', 'password']), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();
        $request->user()->forceFill(['last_login_at' => now()])->save();

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'auth.login',
            'ip_address' => $request->ip(),
        ]);

        return new SessionResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $request->user()->update([
            'password' => Hash::make($request->validated('password')),
            'password_changed_at' => now(),
        ]);
        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'auth.password_changed',
            'ip_address' => $request->ip(),
        ]);
        $request->session()->regenerate();
        DB::table('sessions')->where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Password updated.']);
    }
}
