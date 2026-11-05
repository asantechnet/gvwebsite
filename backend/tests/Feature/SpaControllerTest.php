<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class SpaControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    private string $dist;

    protected function setUp(): void
    {
        parent::setUp();
        $this->dist = storage_path('framework/testing/spa-controller');
        File::ensureDirectoryExists($this->dist.'/dr/about');
        File::put($this->dist.'/index.html', '<html>application</html>');
        File::put($this->dist.'/dr/about/index.html', '<html>about snapshot</html>');
        File::put($this->dist.'/route-manifest.json', json_encode(['/dr', '/dr/about']));
        config(['globalvision.frontend_dist' => $this->dist]);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->dist);
        parent::tearDown();
    }

    public function test_known_public_route_returns_generated_snapshot(): void
    {
        $this->get('/dr/about')->assertOk()->assertSee('about snapshot');
    }

    public function test_unknown_localized_route_returns_404_with_noindex_header(): void
    {
        $this->get('/dr/not-real')
            ->assertNotFound()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
            ->assertSee('application');
    }

    public function test_dashboard_route_returns_application_with_noindex_header(): void
    {
        $this->get('/dashboard/settings')
            ->assertOk()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }

    public function test_unprefixed_public_route_redirects_to_dari(): void
    {
        $this->get('/about')->assertRedirect('/dr/about');
    }

    public function test_root_redirects_to_dari_home(): void
    {
        $this->get('/')->assertRedirect('/dr');
    }
}
