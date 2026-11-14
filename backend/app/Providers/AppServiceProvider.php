<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\DevCommands;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            DevCommands::register('cd public && exec php -d upload_max_filesize=500M -d post_max_size=501M -S 127.0.0.1:8000 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php', 'server')->blue();
        }

        Gate::define('manage-media', fn (User $user): bool => $user->hasPermission('media.manage'));

        RateLimiter::for('login', fn (Request $request): Limit => Limit::perMinute(5)->by(
            mb_strtolower((string) $request->input('email')).'|'.$request->ip(),
        ));

        RateLimiter::for('contact', fn (Request $request): Limit => Limit::perMinute(5)->by($request->ip()));
        RateLimiter::for('password-reset', fn (Request $request): Limit => Limit::perMinute(3)->by(
            mb_strtolower((string) $request->input('email')).'|'.$request->ip(),
        ));
        RateLimiter::for('privileged', fn (Request $request): Limit => Limit::perMinute(10)->by(
            ($request->user()?->id ?? 'guest').'|'.$request->ip(),
        ));
    }
}
