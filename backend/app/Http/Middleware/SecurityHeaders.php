<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-site');

        if ($request->is('api/*')) {
            $response->headers->set('Cache-Control', 'no-store, private');
            $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
        } elseif (str_contains((string) $response->headers->get('Content-Type'), 'text/html')) {
            $hashes = $this->inlineScriptHashes((string) $response->getContent());
            $response->headers->set('Content-Security-Policy', implode('; ', [
                "default-src 'self'",
                "base-uri 'self'",
                "connect-src 'self'",
                "font-src 'self' data:",
                "form-action 'self'",
                "frame-ancestors 'none'",
                'frame-src https://www.youtube.com https://player.vimeo.com',
                "img-src 'self' data: blob: https:",
                "media-src 'self' blob: https:",
                "object-src 'none'",
                "script-src 'self'".($hashes ? ' '.$hashes : ''),
                "style-src 'self' 'unsafe-inline'",
            ]));
        }

        if (app()->isProduction() && $request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }

    private function inlineScriptHashes(string $html): string
    {
        preg_match_all('/<script(?:\s[^>]*)?>(.*?)<\/script>/is', $html, $matches);

        return collect($matches[1] ?? [])
            ->filter()
            ->map(fn (string $script): string => "'sha256-".base64_encode(hash('sha256', $script, true))."'")
            ->unique()
            ->implode(' ');
    }
}
