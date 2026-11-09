import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const frontendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDirectory = path.resolve(frontendDirectory, '../backend')

const prepare = spawnSync('php', ['artisan', 'migrate', '--force'], {
  cwd: backendDirectory,
  encoding: 'utf8',
  stdio: 'pipe',
})

if (prepare.stdout) process.stdout.write(prepare.stdout)
if (prepare.stderr) process.stderr.write(prepare.stderr)

if (prepare.status !== 0) {
  process.stderr.write('\nDevelopment startup stopped because Laravel could not connect to MariaDB. Ensure the MariaDB system service is running, then retry `pnpm dev`.\n')
  process.exit(prepare.status || 1)
}

const processes = [
  spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
    cwd: backendDirectory,
    stdio: 'inherit',
  }),
  spawn(path.join(frontendDirectory, 'node_modules/.bin/vite'), ['--host=127.0.0.1', '--port=5173', '--strictPort'], {
    cwd: frontendDirectory,
    stdio: 'inherit',
  }),
]

let stopping = false

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true
  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(exitCode), 250)
}

for (const child of processes) {
  child.on('error', (error) => {
    process.stderr.write(`Development process failed: ${error.message}\n`)
    stop(1)
  })
  child.on('exit', (code, signal) => {
    if (!stopping) stop(signal ? 0 : (code ?? 1))
  })
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
