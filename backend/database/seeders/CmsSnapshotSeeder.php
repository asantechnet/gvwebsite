<?php

namespace Database\Seeders;

use App\Models\SiteSnapshot;
use Illuminate\Database\Seeder;
use RuntimeException;

class CmsSnapshotSeeder extends Seeder
{
    private const LOCALES = ['prs', 'ps', 'en'];

    public function run(): void
    {
        foreach (['home', 'about', 'contact', 'magazine', 'scholarships'] as $key) {
            $this->seedSnapshot($key, $this->localizedPage($key));
        }

        $this->seedSnapshot('collection:services', $this->serviceRecords());
        $this->seedSnapshot('collection:tourism', $this->tourismRecords());
        $this->seedSnapshot('collection:opportunities', $this->opportunityRecords());
        $this->seedSnapshot('settings', [
            'settings' => ['defaultLanguage' => 'prs', 'maintenanceMode' => false],
            'branding' => [
                'primary' => '#f47e26',
                'secondary' => '#80027f',
                'lightLogo' => '',
                'darkLogo' => '',
                'lightIcon' => '',
                'darkIcon' => '',
            ],
        ]);
        $this->seedSnapshot('profile', [
            'prs' => 'گلوبل ویژن',
            'ps' => 'ګلوبل ویژن',
            'en' => 'Global Vision',
        ]);
        $this->seedSnapshot('media', $this->mediaRecords());
    }

    private function seedSnapshot(string $key, array $payload): void
    {
        SiteSnapshot::query()->firstOrCreate(
            ['key' => $key],
            ['payload' => $payload, 'version' => 1, 'published_at' => now()],
        );
    }

    private function localizedPage(string $page): array
    {
        return collect(self::LOCALES)
            ->mapWithKeys(fn (string $locale): array => [$locale => $this->websiteJson($locale, $page)])
            ->all();
    }

    private function serviceRecords(): array
    {
        $localized = $this->localizedRecords('services', 'services');

        return collect($localized['prs'])->map(function (array $service) use ($localized): array {
            $translations = $this->translationsBySlug($localized, $service['slug'], 'title', 'description');

            return [
                ...$service,
                'id' => $service['slug'],
                'href' => '/services/'.$service['slug'],
                'status' => 'published',
                'translations' => $translations,
            ];
        })->values()->all();
    }

    private function tourismRecords(): array
    {
        $localized = collect(self::LOCALES)->mapWithKeys(
            fn (string $locale): array => [$locale => $this->websiteJson($locale, 'tourism')],
        )->all();

        return collect(['afghanistan', 'world'])->flatMap(function (string $type) use ($localized): array {
            return collect($localized['prs'][$type]['cards'])->map(function (array $card) use ($localized, $type): array {
                $translations = collect(self::LOCALES)->mapWithKeys(function (string $locale) use ($localized, $type, $card): array {
                    $translated = collect($localized[$locale][$type]['cards'])->firstWhere('slug', $card['slug']) ?? [];

                    return [$locale => [
                        ...$translated,
                        'title' => $translated['name'] ?? '',
                        'excerpt' => $translated['description'] ?? '',
                        'content' => $translated['content'] ?? '',
                        'tags' => $translated['tags'] ?? [],
                        'seoTitle' => $translated['seoTitle'] ?? ($translated['name'] ?? ''),
                        'metaDescription' => $translated['metaDescription'] ?? ($translated['description'] ?? ''),
                        'imageAlt' => $translated['imageAlt'] ?? '',
                    ]];
                })->all();

                return [
                    ...$card,
                    'id' => $type.':'.$card['slug'],
                    'type' => $type,
                    'title' => $card['name'],
                    'category' => $localized['prs'][$type]['cardsTitle'],
                    'href' => '/tourism/'.$type.'/'.$card['slug'],
                    'status' => 'published',
                    'translations' => $translations,
                ];
            })->all();
        })->values()->all();
    }

    private function opportunityRecords(): array
    {
        $localized = collect(self::LOCALES)->mapWithKeys(
            fn (string $locale): array => [$locale => $this->websiteJson($locale, 'opportunities')],
        )->all();

        $records = collect(['study', 'work', 'migration', 'investment'])->map(function (string $type) use ($localized): array {
            $post = $localized['prs'][$type]['post'];
            $translations = collect(self::LOCALES)->mapWithKeys(function (string $locale) use ($localized, $type): array {
                $translated = $localized[$locale][$type]['post'];

                return [$locale => [
                    ...$translated,
                    'excerpt' => $translated['description'] ?? '',
                    'content' => $translated['content'] ?? '',
                    'tags' => $translated['tags'] ?? [],
                    'seoTitle' => $translated['seoTitle'] ?? ($translated['title'] ?? ''),
                    'metaDescription' => $translated['metaDescription'] ?? ($translated['description'] ?? ''),
                    'imageAlt' => $translated['imageAlt'] ?? '',
                ]];
            })->all();

            return [
                ...$post,
                'id' => $type,
                'type' => $type,
                'href' => '/opportunities/'.$type,
                'status' => 'published',
                'translations' => $translations,
            ];
        });

        $guides = collect(self::LOCALES)->mapWithKeys(
            fn (string $locale): array => [$locale => $this->websiteJson($locale, 'guides')],
        )->all();
        $ielts = collect($guides['prs']['exams'])->firstWhere('slug', 'ielts');
        if ($ielts) {
            $translations = collect(self::LOCALES)->mapWithKeys(function (string $locale) use ($guides): array {
                $translated = collect($guides[$locale]['exams'])->firstWhere('slug', 'ielts') ?? [];

                return [$locale => [
                    ...$translated,
                    'title' => $translated['name'] ?? 'IELTS',
                    'excerpt' => $translated['summary'] ?? '',
                    'content' => '',
                    'tags' => [],
                    'seoTitle' => $translated['name'] ?? 'IELTS',
                    'metaDescription' => $translated['summary'] ?? '',
                    'imageAlt' => '',
                ]];
            })->all();
            $records->push([
                ...$ielts,
                'id' => 'ielts',
                'type' => 'exams',
                'title' => $ielts['name'],
                'description' => $ielts['summary'],
                'href' => '/opportunities/exams/ielts',
                'status' => 'published',
                'translations' => $translations,
            ]);
        }

        return $records->values()->all();
    }

    private function translationsBySlug(array $localized, string $slug, string $titleKey, string $descriptionKey): array
    {
        return collect(self::LOCALES)->mapWithKeys(function (string $locale) use ($localized, $slug, $titleKey, $descriptionKey): array {
            $translated = collect($localized[$locale])->firstWhere('slug', $slug) ?? [];

            return [$locale => [
                ...$translated,
                'title' => $translated[$titleKey] ?? '',
                'excerpt' => $translated[$descriptionKey] ?? '',
                'content' => $translated['content'] ?? '',
                'tags' => $translated['tags'] ?? [],
                'seoTitle' => $translated['seoTitle'] ?? ($translated[$titleKey] ?? ''),
                'metaDescription' => $translated['metaDescription'] ?? ($translated[$descriptionKey] ?? ''),
                'imageAlt' => $translated['imageAlt'] ?? '',
            ]];
        })->all();
    }

    private function localizedRecords(string $page, string $key): array
    {
        return collect(self::LOCALES)->mapWithKeys(
            fn (string $locale): array => [$locale => $this->websiteJson($locale, $page)[$key]],
        )->all();
    }

    private function mediaRecords(): array
    {
        $records = [
            ['/assets/images/home/hero-globe.webp', 'hero-globe.webp'],
            ['/assets/images/destinations/germany.webp', 'germany.webp'],
            ['/assets/images/destinations/turkiye.webp', 'turkiye.webp'],
            ['/assets/images/destinations/italy.webp', 'italy.webp'],
            ['/assets/images/destinations/france.webp', 'france.webp'],
            ['/assets/images/destinations/netherlands.webp', 'netherlands.webp'],
            ['/assets/images/team/murtaza.webp', 'murtaza.webp'],
            ['/assets/branding/new logo.webp', 'global-vision-logo.webp'],
        ];

        return collect($records)->map(fn (array $record, int $index): array => [
            'id' => 'seed-'.$index,
            'url' => $record[0],
            'name' => $record[1],
            'type' => 'image',
            'meta' => 'Image',
            'local' => false,
        ])->all();
    }

    private function websiteJson(string $locale, string $page): array
    {
        $path = base_path('../frontend/src/website/locales/'.$locale.'/'.$page.'.json');
        if (! is_file($path)) {
            throw new RuntimeException('Missing frontend content file: '.$path);
        }

        $content = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        if (! is_array($content)) {
            throw new RuntimeException('Invalid frontend content file: '.$path);
        }

        return $content;
    }
}
