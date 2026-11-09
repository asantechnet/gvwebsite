<?php

namespace Tests\Feature\Cms;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MapLinkControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_google_maps_place_link_becomes_an_embed_location(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->postJson('/api/cms/map-link', [
            'url' => 'https://www.google.com/maps/place/Global+Vision/@34.529568,69.170508,15z',
        ])->assertOk()
            ->assertJsonPath('data.location', 'Global Vision')
            ->assertJsonPath('data.embedUrl', 'https://maps.google.com/maps?q=Global%20Vision&ll=34.529568%2C69.170508&z=15&output=embed');
    }

    public function test_short_google_maps_link_is_resolved(): void
    {
        Http::fake([
            'https://maps.app.goo.gl/example' => Http::response('', 302, ['Location' => '/redirect']),
            'https://maps.app.goo.gl/redirect' => Http::response('', 302, ['Location' => 'https://www.google.com/maps/place/Kabul/@34.5553,69.2075,15z']),
            'https://www.google.com/maps/place/Kabul/@34.5553,69.2075,15z' => Http::response(),
        ]);
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->postJson('/api/cms/map-link', [
            'url' => 'https://maps.app.goo.gl/example',
        ])->assertOk()->assertJsonPath('data.location', 'Kabul');
    }

    public function test_saved_place_uses_marker_coordinates_instead_of_viewport_center(): void
    {
        Http::fake([
            'https://maps.app.goo.gl/VKrqSucaUh8jk3Yq5' => Http::response('', 302, [
                'Location' => 'https://www.google.com/maps/place/Kabul+Water+Park/@34.5049356,69.1376135,18.24z/data=!4m6!3m5!1s0x38d168d0aebeca55:0xbfb55451a5bb7d82!8m2!3d34.5048525!4d69.1382986!16s%2Fg%2F1ptx0krbv',
            ]),
            'https://www.google.com/maps/place/*' => Http::response(),
        ]);
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->postJson('/api/cms/map-link', [
            'url' => 'https://maps.app.goo.gl/VKrqSucaUh8jk3Yq5',
        ])->assertOk()
            ->assertJsonPath('data.location', 'Kabul Water Park')
            ->assertJsonPath('data.embedUrl', 'https://maps.google.com/maps?q=Kabul%20Water%20Park&ll=34.5048525%2C69.1382986&z=15&output=embed');
    }

    public function test_non_google_link_is_rejected(): void
    {
        $user = User::factory()->create(['permissions' => ['content.manage']]);

        $this->actingAs($user)->postJson('/api/cms/map-link', [
            'url' => 'https://example.com/location',
        ])->assertUnprocessable()->assertJsonValidationErrors('url');
    }
}
