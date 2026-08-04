import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const nextCommand = process.platform === 'win32' ? 'next.cmd' : 'next'

const dbCommandArgs = process.env.NODE_ENV === 'production'
  ? ['db', 'push'] // In production, do not use --accept-data-loss to prevent accidental data loss
  : ['db', 'push', '--accept-data-loss'] // For development/preview, accept data loss for convenience

const steps = [
  { command: npxCommand, args: ['prisma', 'generate'] },
  { command: npxCommand, args: ['prisma', ...dbCommandArgs] },
  { command: nextCommand, args: ['build'] },
]

for (const step of steps) {
  const result = spawnSync(step.command, step.args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
