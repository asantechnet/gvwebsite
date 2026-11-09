<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\ResolveMapLinkRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class MapLinkController extends Controller
{
    public function __invoke(ResolveMapLinkRequest $request): JsonResponse
    {
        $url = $request->validated('url');
        $this->ensureGoogleMapsUrl($url);
        $resolvedUrl = $this->isShortUrl($url) ? $this->resolveShortUrl($url) : $url;
        [$location, $coordinates] = $this->mapDetailsFromUrl($resolvedUrl);
        $embedUrl = 'https://maps.google.com/maps?q='.rawurlencode($location);
        if ($coordinates !== null) {
            $embedUrl .= '&ll='.rawurlencode($coordinates);
        }

        return response()->json(['data' => [
            'location' => $location,
            'embedUrl' => $embedUrl.'&z=15&output=embed',
        ]]);
    }

    private function isShortUrl(string $url): bool
    {
        return in_array(mb_strtolower((string) parse_url($url, PHP_URL_HOST)), ['maps.app.goo.gl', 'goo.gl'], true);
    }

    private function resolveShortUrl(string $url): string
    {
        $current = $url;
        for ($redirects = 0; $redirects < 8; $redirects++) {
            $this->ensureGoogleMapsUrl($current);
            $response = Http::timeout(10)->withOptions(['allow_redirects' => false])->get($current);
            if (! $response->redirect()) {
                return $current;
            }
            $location = $response->header('Location');
            if (! is_string($location)) {
                break;
            }
            $current = $this->absoluteRedirectUrl($current, $location);
        }

        throw ValidationException::withMessages(['url' => ['The Google Maps link could not be resolved.']]);
    }

    private function absoluteRedirectUrl(string $current, string $location): string
    {
        if (str_starts_with($location, 'https://')) {
            return $location;
        }
        if (str_starts_with($location, '/')) {
            $parts = parse_url($current);

            return 'https://'.$parts['host'].$location;
        }

        throw ValidationException::withMessages(['url' => ['The Google Maps redirect was not safe.']]);
    }

    private function ensureGoogleMapsUrl(string $url): void
    {
        $host = mb_strtolower((string) parse_url($url, PHP_URL_HOST));
        $allowed = in_array($host, ['maps.app.goo.gl', 'goo.gl', 'maps.google.com', 'google.com'], true)
            || str_ends_with($host, '.google.com');
        if (! $allowed) {
            throw ValidationException::withMessages(['url' => ['Enter a valid Google Maps link.']]);
        }
    }

    /** @return array{string, string|null} */
    private function mapDetailsFromUrl(string $url): array
    {
        $query = [];
        parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
        $location = $query['q'] ?? $query['query'] ?? $query['destination'] ?? null;
        $coordinates = null;
        if (preg_match('/!3d(-?\d+(?:\.\d+)?).*?!4d(-?\d+(?:\.\d+)?)/', $url, $marker)) {
            $coordinates = $marker[1].','.$marker[2];
        }
        if ($coordinates === null && preg_match('/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/', $url, $viewport)) {
            $coordinates = $viewport[1].','.$viewport[2];
        }
        if (! $location && preg_match('~/maps/(?:place|search)/([^/@?]+)~', $url, $place)) {
            $location = urldecode(str_replace('+', ' ', $place[1]));
        }
        if (! $location) {
            $location = $coordinates;
        }
        if (! is_string($location) || trim($location) === '') {
            throw ValidationException::withMessages(['url' => ['The location could not be read from this Google Maps link.']]);
        }

        return [trim($location), $coordinates];
    }
}
