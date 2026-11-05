# Global Vision production deployment

The repository is prepared for a single-origin deployment where Nginx serves static files from `frontend/dist` and forwards application routes to Laravel. Replace every example path and domain before use.

## Required external services

- PHP 8.3 or newer with the extensions required by Laravel, including PDO MySQL.
- MariaDB with a dedicated database and least-privilege application user.
- A process supervisor for the queue worker.
- A cron entry for Laravel's scheduler.
- SMTP credentials for password recovery and contact notifications.
- ClamAV with `clamdscan` available to the PHP/queue user when upload scanning is enabled.
- TLS certificates, off-site database backups, uploaded-file backups, and error monitoring.

## Build and release

```bash
cd frontend
npm ci
VITE_DATA_SOURCE=api VITE_API_BASE_URL=/api VITE_SITE_URL=https://globalvision.af CMS_API_URL=https://globalvision.af/api npm run build

cd ../backend
composer install --no-dev --classmap-authoritative --no-interaction
php artisan migrate --force
php artisan storage:link
php artisan optimize
php artisan event:cache
```

Set `FRONTEND_DIST_PATH` to the absolute path of `frontend/dist`. The generated `route-manifest.json` lets Laravel return real `404` responses for unknown localized routes while serving generated metadata snapshots for known routes.

## Runtime processes

Run one or more queue workers under a process supervisor:

```bash
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

Run the scheduler once per minute:

```cron
* * * * * cd /var/www/globalvision/backend && php artisan schedule:run >> /dev/null 2>&1
```

After every release, restart long-running workers with `php artisan queue:restart`.

## Backups and recovery

- Take encrypted MariaDB backups and uploaded-file backups to storage outside the application server.
- Retain multiple daily, weekly, and monthly generations according to organizational policy.
- Test restoration into an isolated environment regularly; a backup that has not been restored is unverified.
- Monitor failed jobs, queue age, disk space, `/up`, application errors, SMTP failures, and ClamAV availability.

## Launch checks

1. Use `APP_ENV=production`, `APP_DEBUG=false`, HTTPS URLs, secure cookies, and production secrets.
2. Configure the administrator and super-user credentials, `CONTACT_NOTIFICATION_EMAIL`, SMTP, queue, MariaDB, Sanctum domains, and upload scanning. Use separate, unique passwords for `GLOBALVISION_ADMIN_PASSWORD` and `GLOBALVISION_SUPER_USER_PASSWORD`.
3. Confirm `/api/site/snapshots`, CMS login, password recovery, contact submission, upload scanning, and queue delivery.
4. Confirm known routes return `200`, unknown localized routes return `404`, and CMS routes include `X-Robots-Tag: noindex`.
5. Submit `sitemap.xml`, configure monitoring, perform a backup, and complete a restoration drill before launch.

Infrastructure credentials and external service activation are intentionally not stored in this repository.
