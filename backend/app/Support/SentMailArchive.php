<?php

namespace App\Support;

use RuntimeException;

class SentMailArchive
{
    /** @var resource|null */
    private $connection;

    private int $tag = 0;

    public function verify(): string
    {
        $username = (string) config('mail.mailers.smtp.username');
        $password = (string) config('mail.mailers.smtp.password');
        if ($username === '' || $password === '') {
            throw new RuntimeException('The mailbox username or password is not configured.');
        }

        try {
            $this->connect();
            $this->command('LOGIN '.$this->quote($username).' '.$this->quote($password));
            $folder = config('globalvision.sent_mail_archive.folder') ?: $this->findSentFolder();
            $this->command('LOGOUT');

            return $folder;
        } finally {
            if (is_resource($this->connection)) {
                fclose($this->connection);
            }
            $this->connection = null;
        }
    }

    public function append(string $recipient, string $subject, string $body): void
    {
        if (! config('globalvision.sent_mail_archive.enabled')) {
            return;
        }

        $username = (string) config('mail.mailers.smtp.username');
        $password = (string) config('mail.mailers.smtp.password');
        if ($username === '' || $password === '') {
            throw new RuntimeException('The mailbox username or password is not configured.');
        }

        try {
            $this->connect();
            $this->command('LOGIN '.$this->quote($username).' '.$this->quote($password));
            $folder = config('globalvision.sent_mail_archive.folder') ?: $this->findSentFolder();
            $message = $this->message($username, $recipient, $subject, $body);
            $tag = $this->nextTag();
            $this->write($tag.' APPEND '.$this->quote($folder).' (\\Seen) {'.strlen($message)."}\r\n");
            $this->readUntilContinuation($tag);
            $this->write($message."\r\n");
            $this->readTagged($tag);
            $this->command('LOGOUT');
        } finally {
            if (is_resource($this->connection)) {
                fclose($this->connection);
            }
            $this->connection = null;
        }
    }

    private function connect(): void
    {
        $host = (string) config('globalvision.sent_mail_archive.host');
        $port = (int) config('globalvision.sent_mail_archive.port');
        $connection = @stream_socket_client("ssl://{$host}:{$port}", $errorNumber, $errorMessage, 15);
        if ($connection === false) {
            throw new RuntimeException("Could not connect to the sent mailbox: {$errorMessage} ({$errorNumber}).");
        }
        stream_set_timeout($connection, 15);
        $this->connection = $connection;
        $greeting = fgets($connection);
        if (! is_string($greeting) || ! str_starts_with($greeting, '* OK')) {
            throw new RuntimeException('The sent mailbox did not return a valid IMAP greeting.');
        }
    }

    private function findSentFolder(): string
    {
        $response = $this->command('LIST "" "*"');
        foreach ($response as $line) {
            if (stripos($line, '\\Sent') !== false && preg_match('/ "([^"]+)"\s*$/', $line, $match)) {
                return str_replace('\\"', '"', $match[1]);
            }
        }

        return 'Sent';
    }

    /** @return list<string> */
    private function command(string $command): array
    {
        $tag = $this->nextTag();
        $this->write($tag.' '.$command."\r\n");

        return $this->readTagged($tag);
    }

    /** @return list<string> */
    private function readTagged(string $tag): array
    {
        $lines = [];
        while (($line = fgets($this->connection)) !== false) {
            $lines[] = rtrim($line, "\r\n");
            if (str_starts_with($line, $tag.' ')) {
                if (! str_starts_with($line, $tag.' OK')) {
                    throw new RuntimeException('The sent mailbox rejected the IMAP command.');
                }

                return $lines;
            }
        }

        throw new RuntimeException('The sent mailbox connection ended unexpectedly.');
    }

    private function readUntilContinuation(string $tag): void
    {
        while (($line = fgets($this->connection)) !== false) {
            if (str_starts_with($line, '+')) {
                return;
            }
            if (str_starts_with($line, $tag.' ')) {
                throw new RuntimeException('The sent mailbox rejected the message upload: '.trim($line));
            }
        }

        throw new RuntimeException('The sent mailbox connection ended before accepting the message upload.');
    }

    private function message(string $from, string $to, string $subject, string $body): string
    {
        $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
        $messageId = sprintf('<%s@%s>', bin2hex(random_bytes(16)), parse_url((string) config('app.url'), PHP_URL_HOST) ?: 'localhost');

        return implode("\r\n", [
            'Date: '.date(DATE_RFC2822),
            'From: '.config('mail.from.name').' <'.$from.'>',
            'To: <'.$to.'>',
            'Subject: '.$encodedSubject,
            'Message-ID: '.$messageId,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            str_replace(["\r\n", "\r"], "\n", $body),
        ]);
    }

    private function quote(string $value): string
    {
        return '"'.addcslashes($value, '\\"').'"';
    }

    private function nextTag(): string
    {
        return 'A'.str_pad((string) ++$this->tag, 4, '0', STR_PAD_LEFT);
    }

    private function write(string $value): void
    {
        if (! is_resource($this->connection) || fwrite($this->connection, $value) === false) {
            throw new RuntimeException('Could not write to the sent mailbox connection.');
        }
    }
}
