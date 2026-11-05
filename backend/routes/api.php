<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Cms\AuditLogController;
use App\Http\Controllers\Api\Cms\ContentRecordController;
use App\Http\Controllers\Api\Cms\MessageController;
use App\Http\Controllers\Api\Cms\SiteSnapshotController;
use App\Http\Controllers\Api\Cms\UploadController;
use App\Http\Controllers\Api\Cms\UserController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PublicSiteSnapshotController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/auth/forgot-password', [PasswordResetController::class, 'requestLink'])->middleware('throttle:password-reset');
Route::post('/auth/reset-password', [PasswordResetController::class, 'reset'])->middleware('throttle:password-reset');
Route::post('/contact/messages', ContactMessageController::class)->middleware('throttle:contact');
Route::get('/site/snapshots', [PublicSiteSnapshotController::class, 'index']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/session', [AuthController::class, 'session']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    Route::get('/cms/messages', [MessageController::class, 'index']);
    Route::patch('/cms/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/cms/messages/{message}', [MessageController::class, 'destroy']);

    Route::get('/cms/content/{collection}', [ContentRecordController::class, 'index']);
    Route::post('/cms/content/{collection}', [ContentRecordController::class, 'store']);
    Route::get('/cms/content/{collection}/{contentRecord}', [ContentRecordController::class, 'show']);
    Route::put('/cms/content/{collection}/{contentRecord}', [ContentRecordController::class, 'update']);
    Route::delete('/cms/content/{collection}/{contentRecord}', [ContentRecordController::class, 'destroy']);

    Route::post('/cms/uploads', UploadController::class);
    Route::delete('/cms/uploads', [UploadController::class, 'destroy']);
    Route::get('/cms/snapshots/{key}', [SiteSnapshotController::class, 'show']);
    Route::put('/cms/snapshots/{key}', [SiteSnapshotController::class, 'update']);
    Route::get('/cms/audit-logs', [AuditLogController::class, 'index']);
    Route::middleware('throttle:privileged')->group(function (): void {
        Route::get('/cms/users', [UserController::class, 'index']);
        Route::post('/cms/users', [UserController::class, 'store']);
        Route::get('/cms/users/{user}', [UserController::class, 'show']);
        Route::put('/cms/users/{user}', [UserController::class, 'update']);
        Route::post('/cms/users/{user}/password-reset', [UserController::class, 'sendPasswordReset']);
        Route::delete('/cms/users/{user}', [UserController::class, 'destroy']);
    });
});
