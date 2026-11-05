<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_api_responses_are_not_cached_and_deny_all_content(): void
    {
        $this->getJson('/api/site/snapshots')->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'")
            ->assertHeader('X-Frame-Options', 'DENY')->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_html_response_has_restrictive_content_security_policy_with_inline_hash(): void
    {
        $dist = storage_path('framework/testing/security-headers');
        File::ensureDirectoryExists($dist.'/dr');
        File::put($dist.'/dr/index.html', '<html><script type="application/ld+json">{"safe":true}</script></html>');
        File::put($dist.'/index.html', '<html>app</html>');
        File::put($dist.'/route-manifest.json', json_encode(['/dr']));
        config(['globalvision.frontend_dist' => $dist]);

        $response = $this->get('/dr');

        $response->assertOk();
        $this->assertStringContainsString("default-src 'self'", (string) $response->headers->get('Content-Security-Policy'));
        $this->assertStringContainsString("script-src 'self' 'sha256-", (string) $response->headers->get('Content-Security-Policy'));
        File::deleteDirectory($dist);
    }
}
