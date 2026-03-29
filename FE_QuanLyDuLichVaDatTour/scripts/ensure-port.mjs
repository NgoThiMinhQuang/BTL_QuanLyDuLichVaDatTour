import { execSync } from 'node:child_process'
import process from 'node:process'

const port = process.argv[2] || '5173'
const projectPath = process.cwd()
const normalizedProjectPath = projectPath.toLowerCase().replace(/\\/g, '/')
const viteBinPath = `${normalizedProjectPath}/node_modules/vite/bin/vite.js`
const viteBinPathViaDotBin = `${normalizedProjectPath}/node_modules/.bin/../vite/bin/vite.js`
const viteBinPathWindows = `${normalizedProjectPath}/node_modules/.bin\\../vite/bin/vite.js`
const viteBinMarker = 'vite/bin/vite.js'
const frontendMarker = `${normalizedProjectPath}/node_modules`

function run(command) {
  return execSync(command, {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
  }).trim()
}

function getProcessInfo(pid) {
  try {
    const command = `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"ProcessId = ${pid}\" | Select-Object Name, CommandLine | ConvertTo-Json -Compress"`
    const raw = run(command)

    if (!raw) {
      return null
    }

    const info = JSON.parse(raw)
    const name = String(info.Name || '').toLowerCase()
    const commandLine = String(info.CommandLine || '').toLowerCase().replace(/\\/g, '/')

    return {
      name,
      commandLine,
      isFrontendDevProcess:
        name === 'node.exe' &&
        (commandLine.includes(viteBinPath) ||
          commandLine.includes(viteBinPathViaDotBin) ||
          commandLine.includes(viteBinPathWindows) ||
          (commandLine.includes(viteBinMarker) && commandLine.includes(frontendMarker)) ||
          (commandLine.includes('vite') && commandLine.includes(normalizedProjectPath))),
    }
  } catch {
    return null
  }
}

try {
  const output = run(`netstat -ano -p tcp | findstr :${port}`)

  if (!output) {
    process.exit(0)
  }

  const pids = [...new Set(
    output
      .split(/\r?\n/)
      .map((line) => line.trim().split(/\s+/).pop())
      .filter((pid) => pid && /^\d+$/.test(pid))
  )]

  for (const pid of pids) {
    const info = getProcessInfo(pid)

    if (!info?.isFrontendDevProcess) {
      continue
    }

    try {
      execSync(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`, { stdio: 'ignore' })
    } catch {
      // ignore processes that already exited or cannot be killed
    }
  }
} catch {
  // no process is using the port
}

try {
  const stillInUse = run(`netstat -ano -p tcp | findstr :${port}`)
  if (stillInUse) {
    console.error(`Port ${port} is in use by another process. Please free it manually.`)
    process.exit(1)
  }
} catch {
  // port is free
}

process.exit(0)
