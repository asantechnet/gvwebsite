<?php

return [
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),
    'frontend_dist' => env('FRONTEND_DIST_PATH', base_path('../frontend/dist')),
    'contact_notification_email' => env('CONTACT_NOTIFICATION_EMAIL'),

    'upload_scanning' => [
        'enabled' => env('UPLOAD_SCAN_ENABLED', false),
        'command' => env('UPLOAD_SCAN_COMMAND', 'clamdscan'),
        'timeout' => (int) env('UPLOAD_SCAN_TIMEOUT', 30),
    ],
    'audit_retention_days' => (int) env('AUDIT_RETENTION_DAYS', 365),

    'content_collections' => [
        'home',
        'about',
        'contact',
        'opportunities',
        'tourism',
        'scholarships',
        'services',
        'magazine',
        'settings',
    ],

    'snapshot_keys' => [
        'home', 'about', 'contact', 'magazine', 'scholarships', 'settings', 'profile', 'media',
        'collection:opportunities', 'collection:tourism', 'collection:services',
    ],

    'admin' => [
        'name' => env('GLOBALVISION_ADMIN_NAME', 'Global Vision Administrator'),
        'email' => env('GLOBALVISION_ADMIN_EMAIL'),
        'password' => env('GLOBALVISION_ADMIN_PASSWORD'),
    ],
    'super_user' => [
        'name' => env('GLOBALVISION_SUPER_USER_NAME', 'Global Vision Security Owner'),
        'email' => env('GLOBALVISION_SUPER_USER_EMAIL'),
        'password' => env('GLOBALVISION_SUPER_USER_PASSWORD'),
    ],
];
