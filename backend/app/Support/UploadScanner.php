<?php

namespace App\Support;

use RuntimeException;
use Symfony\Component\Process\Process;

class UploadScanner
{
    public function scan(string $path): void
    {
        if (! config('globalvision.upload_scanning.enabled')) {
            return;
        }

        $process = new Process([
            config('globalvision.upload_scanning.command'),
            '--no-summary',
            $path,
        ]);
        $process->setTimeout(config('globalvision.upload_scanning.timeout'));
        $process->run();

        if ($process->getExitCode() === 1) {
            throw new RuntimeException('The uploaded file did not pass the malware scan.');
        }

        if (! $process->isSuccessful()) {
            throw new RuntimeException('The upload scanner is unavailable.');
        }
    }
}
