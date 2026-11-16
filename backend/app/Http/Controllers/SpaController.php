<?php

namespace App\Http\Controllers;

use App\Models\SiteSnapshot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class SpaController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, ?string $path = null): Response|RedirectResponse
    {
        $dist = rtrim(config('globalvision.frontend_dist'), DIRECTORY_SEPARATOR);
        $requestPath = '/'.ltrim((string) $path, '/');

        if ($requestPath === '/') {
            return redirect('/'.$this->defaultPublicLanguage(), 302);
        }

        if (! preg_match('#^/(dr|ps|en)(?:/|$)#', $requestPath) && ! str_starts_with($requestPath, '/dashboard')) {
            return redirect('/'.$this->defaultPublicLanguage().$requestPath, 301);
        }

        $manifestPath = $dist.'/route-manifest.json';
        $manifest = File::exists($manifestPath) ? json_decode(File::get($manifestPath), true) : [];
        $isDashboard = str_starts_with($requestPath, '/dashboard');
        $isKnownPublicRoute = in_array(rtrim($requestPath, '/') ?: '/', $manifest, true);
        $status = $isDashboard || $isKnownPublicRoute ? 200 : 404;
        $routeFile = $isKnownPublicRoute ? $dist.$requestPath.'/index.html' : $dist.'/index.html';

        abort_unless(File::exists($routeFile), 503, 'The frontend build is unavailable.');

        $html = str_replace(
            'null /*__GLOBALVISION_PUBLISHED_BRANDING__*/',
            json_encode($this->publishedBranding(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT),
            File::get($routeFile),
        );

        return response($html, $status, array_filter([
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Robots-Tag' => $isDashboard || $status === 404 ? 'noindex, nofollow, noarchive' : null,
        ]));
    }

    private function defaultPublicLanguage(): string
    {
        $configured = SiteSnapshot::query()
            ->where('key', 'settings')
            ->whereNotNull('published_at')
            ->value('payload->settings->defaultLanguage');

        return match ($configured) {
            'ps', 'en' => $configured,
            default => 'dr',
        };
    }

    /**
     * @return array{primary: string, secondary: string}|null
     */
    private function publishedBranding(): ?array
    {
        $payload = SiteSnapshot::query()
            ->where('key', 'settings')
            ->whereNotNull('published_at')
            ->value('payload');

        if (is_string($payload)) {
            $payload = json_decode($payload, true);
        }

        $branding = is_array($payload) ? ($payload['branding'] ?? null) : null;

        $primary = strtoupper((string) ($branding['primary'] ?? ''));
        $secondary = strtoupper((string) ($branding['secondary'] ?? ''));

        if (! preg_match('/^#[0-9A-F]{6}$/', $primary) || ! preg_match('/^#[0-9A-F]{6}$/', $secondary)) {
            return null;
        }

        return compact('primary', 'secondary');
    }
}
