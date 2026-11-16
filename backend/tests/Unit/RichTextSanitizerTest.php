<?php

namespace Tests\Unit;

use App\Support\RichTextSanitizer;
use App\Support\SiteSnapshotSanitizer;
use PHPUnit\Framework\TestCase;

class RichTextSanitizerTest extends TestCase
{
    public function test_it_preserves_only_supported_text_alignment_styles(): void
    {
        $sanitizer = new RichTextSanitizer;

        $result = $sanitizer->sanitize(
            '<p style="text-align: CENTER" onclick="alert(1)">Centered</p>'
            .'<p style="color: red">Unstyled</p>',
        );

        $this->assertSame(
            '<p style="text-align: center">Centered</p><p>Unstyled</p>',
            $result,
        );
    }

    public function test_it_sanitizes_scholarship_editor_overview_html(): void
    {
        $sanitizer = new SiteSnapshotSanitizer(new RichTextSanitizer);

        $result = $sanitizer->sanitize([
            'overview' => '<h2 data-icon="✓">Title</h2><script>alert(1)</script>',
        ]);

        $this->assertSame('<h2 data-icon="✓">Title</h2>', $result['overview']);
    }

    public function test_it_preserves_only_valid_youtube_video_ids(): void
    {
        $sanitizer = new RichTextSanitizer;

        $result = $sanitizer->sanitize(
            '<figure data-editor-media data-media-type="video" data-youtube-id="dQw4w9WgXcQ"></figure>'
            .'<figure data-editor-media data-media-type="video" data-youtube-id="bad/value"></figure>',
        );

        $this->assertStringContainsString('data-youtube-id="dQw4w9WgXcQ"', $result);
        $this->assertStringNotContainsString('bad/value', $result);
    }
}
