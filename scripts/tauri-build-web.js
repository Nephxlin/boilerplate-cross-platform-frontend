const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const apiPath = path.join(__dirname, '..', 'src', 'app', 'api')
const apiBackupPath = path.join(__dirname, '..', 'src', 'app', '_api_backup')
const nextCachePath = path.join(__dirname, '..', '.next')

// Remove directory recursively
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

// Move API folder to backup (exclude from static export)
function moveApiFolder() {
  if (fs.existsSync(apiPath)) {
    fs.renameSync(apiPath, apiBackupPath)
    console.log('API folder moved to backup for static export')
  }
}

// Restore API folder
function restoreApiFolder() {
  if (fs.existsSync(apiBackupPath)) {
    fs.renameSync(apiBackupPath, apiPath)
    console.log('API folder restored')
  }
}

async function main() {
  try {
    // Set environment and move API folder
    process.env.TAURI_ENV_TARGET = '1'

    // Clear .next cache to avoid stale type references
    console.log('Clearing Next.js cache...')
    removeDir(nextCachePath)

    moveApiFolder()

    // Run Next.js build
    console.log('Building Next.js for static export...')
    execSync('next build', { stdio: 'inherit', env: { ...process.env, TAURI_ENV_TARGET: '1' } })

    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error.message)
    process.exit(1)
  } finally {
    // Always restore API folder
    restoreApiFolder()
  }
}

main()
