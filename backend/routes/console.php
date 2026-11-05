<?php

use App\Models\AuditLog;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
    AuditLog::query()
        ->where('created_at', '<', now()->subDays(config('globalvision.audit_retention_days')))
        ->delete();
})->dailyAt('02:30')->name('prune-audit-logs')->withoutOverlapping();

Schedule::command('auth:clear-resets')->dailyAt('02:45');
Schedule::command('queue:prune-batches --hours=168 --unfinished=168 --cancelled=168')->dailyAt('03:00');
Schedule::command('queue:prune-failed --hours=336')->dailyAt('03:15');
