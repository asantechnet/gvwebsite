<?php

namespace App\Support;

class SiteSnapshotSanitizer
{
    /** @var list<string> */
    private const URL_KEYS = [
        'href', 'url', 'image', 'avatar', 'poster', 'socialimage', 'canonicalurl',
        'primaryactionhref', 'secondaryactionhref', 'viewallhref', 'lightlogo', 'darklogo',
    ];

    public function __construct(private RichTextSanitizer $richTextSanitizer) {}

    /** @param array<string|int, mixed> $payload */
    public function sanitize(array $payload): array
    {
        return $this->walk($payload);
    }

    /**
     * @param  array<string|int, mixed>  $values
     * @return array<string|int, mixed>
     */
    private function walk(array $values): array
    {
        foreach ($values as $key => &$value) {
            if (is_array($value)) {
                $value = $this->walk($value);

                continue;
            }

            if (! is_string($value)) {
                continue;
            }

            $normalizedKey = mb_strtolower((string) $key);
            if (in_array($normalizedKey, ['content', 'overview'], true)) {
                $value = $this->richTextSanitizer->sanitize($value);
            } elseif (in_array($normalizedKey, self::URL_KEYS, true) && ! $this->richTextSanitizer->isSafeUrl($value)) {
                $value = '';
            }
        }

        return $values;
    }
}
