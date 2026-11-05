<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use LazilyRefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_root_redirects_to_default_dari_home(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/dr');
    }
}
