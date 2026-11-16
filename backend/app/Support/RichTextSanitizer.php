<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

class RichTextSanitizer
{
    /** @var list<string> */
    private const ALLOWED_TAGS = [
        'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
        'ul', 'ol', 'li', 'a', 'div', 'span', 'figure', 'figcaption', 'img', 'video',
        'audio', 'source',
    ];

    /** @var list<string> */
    private const ALLOWED_ATTRIBUTES = [
        'alt', 'controls', 'dir', 'href', 'loading', 'preload', 'poster', 'rel', 'src',
        'target', 'title', 'type', 'style', 'data-highlight-box', 'data-icon', 'data-columns',
        'data-editor-media', 'data-src', 'data-media-type', 'data-name', 'data-title',
        'data-caption', 'data-alt', 'data-author', 'data-avatar', 'data-poster',
        'data-mime-type', 'data-youtube-id', 'data-media-grid', 'data-layout', 'data-items',
        'data-editor-button', 'data-label', 'data-href',
    ];

    /** @var list<string> */
    private const URL_ATTRIBUTES = [
        'href', 'src', 'poster', 'data-src', 'data-avatar', 'data-poster', 'data-href',
    ];

    /**
     * @param  array<string, array<string, mixed>>  $translations
     * @return array<string, array<string, mixed>>
     */
    public function sanitizeTranslations(array $translations): array
    {
        foreach ($translations as &$translation) {
            $translation['content'] = $this->sanitize((string) ($translation['content'] ?? ''));
        }

        return $translations;
    }

    public function sanitize(string $html): string
    {
        if (trim($html) === '') {
            return '';
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="UTF-8"><div id="rich-text-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('rich-text-root');
        if (! $root) {
            return '';
        }

        $this->cleanChildren($root);

        $clean = '';
        foreach ($root->childNodes as $child) {
            $clean .= $document->saveHTML($child);
        }

        return $clean;
    }

    private function cleanChildren(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if (! $node instanceof DOMElement) {
                continue;
            }

            $tag = mb_strtolower($node->tagName);
            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                if (in_array($tag, ['form', 'iframe', 'math', 'object', 'script', 'style', 'svg', 'template'], true)) {
                    $parent->removeChild($node);

                    continue;
                }

                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);

                continue;
            }

            foreach (iterator_to_array($node->attributes) as $attribute) {
                $name = mb_strtolower($attribute->name);
                $value = $attribute->value;

                if (! in_array($name, self::ALLOWED_ATTRIBUTES, true)
                    || (in_array($name, self::URL_ATTRIBUTES, true) && ! $this->isSafeUrl($value))
                    || ($name === 'data-youtube-id' && ! preg_match('/^[A-Za-z0-9_-]{11}$/', $value))
                    || ($name === 'style' && ! preg_match('/^\s*text-align\s*:\s*(left|center|right)\s*;?\s*$/i', $value))
                    || ($name === 'target' && $value !== '_blank')) {
                    $node->removeAttribute($attribute->name);
                }
            }

            if ($node->hasAttribute('style')) {
                preg_match('/text-align\s*:\s*(left|center|right)/i', $node->getAttribute('style'), $alignment);
                $node->setAttribute('style', 'text-align: '.mb_strtolower($alignment[1]));
            }

            if ($tag === 'a' && $node->getAttribute('target') === '_blank') {
                $node->setAttribute('rel', 'noopener noreferrer');
            }

            if ($node->hasAttribute('data-items')) {
                $node->setAttribute('data-items', $this->sanitizeMediaItems($node->getAttribute('data-items')));
            }

            $this->cleanChildren($node);
        }
    }

    public function isSafeUrl(string $url): bool
    {
        $url = trim($url);
        if ($url === '' || str_starts_with($url, '#')) {
            return true;
        }

        if (str_starts_with($url, '/') && ! str_starts_with($url, '//')) {
            return true;
        }

        $scheme = mb_strtolower((string) parse_url($url, PHP_URL_SCHEME));

        return in_array($scheme, ['http', 'https', 'mailto', 'tel'], true);
    }

    private function sanitizeMediaItems(string $value): string
    {
        $items = json_decode($value, true);
        if (! is_array($items)) {
            return '[]';
        }

        $items = array_slice($items, 0, 12);
        foreach ($items as &$item) {
            if (! is_array($item)) {
                $item = null;

                continue;
            }

            foreach (['src', 'avatar', 'poster'] as $key) {
                if (isset($item[$key]) && ! $this->isSafeUrl((string) $item[$key])) {
                    $item[$key] = '';
                }
            }
            if (isset($item['youtubeId']) && ! preg_match('/^[A-Za-z0-9_-]{11}$/', (string) $item['youtubeId'])) {
                $item['youtubeId'] = '';
            }
        }

        return json_encode($items, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';
    }
}
