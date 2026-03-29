import { execSync } from 'node:child_process'
import process from 'node:process'

const port = process.argv[2] || '5173'
const normalizedProjectPath = process.cwd().toLowerCase().replace(/\\/g, '/')
const viteMarker = `${normalizedProjectPath}/node_modules`

function run(command) {
  return execSync(command, {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
  }).trim()
}

try {
  const raw = run(`powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*vite*' } | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"`)

  if (raw) {
    const parsed = JSON.parse(raw)
    const items = Array.isArray(parsed) ? parsed : [parsed]

    for (const item of items) {
      const pid = String(item.ProcessId || '')
      const commandLine = String(item.CommandLine || '').toLowerCase().replace(/\\/g, '/')
      const isFrontendVite = commandLine.includes(viteMarker) && commandLine.includes('vite/bin/vite.js')

      if (!pid || !isFrontendVite) {
        continue
      }

      try {
        execSync(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`, { stdio: 'ignore' })
      } catch {
        // ignore processes that already exited or cannot be killed
      }
    }
  }
} catch {
  // ignore process lookup errors
}

try {
  const connections = run(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' } | Select-Object OwningProcess | ConvertTo-Json -Compress"`)

  if (!connections) {
    process.exit(0)
  }

  const parsed = JSON.parse(connections)
  const items = Array.isArray(parsed) ? parsed : [parsed]
  const listeningPids = items
    .map((item) => String(item.OwningProcess || ''))
    .filter(Boolean)

  if (listeningPids.length === 0) {
    process.exit(0)
  }

  const detailRaw = run(`powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { ${listeningPids.map((pid) => ` $_.ProcessId -eq ${pid} `).join('-or')} } | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"`)
  const detailParsed = JSON.parse(detailRaw)
  const detailItems = Array.isArray(detailParsed) ? detailParsed : [detailParsed]

  const hasForeignListener = detailItems.some((item) => {
    const commandLine = String(item.CommandLine || '').toLowerCase().replace(/\\/g, '/')
    return !(String(item.Name || '').toLowerCase() === 'node.exe' && commandLine.includes(viteMarker) && commandLine.includes('vite/bin/vite.js'))
  })

  if (hasForeignListener) {
    console.error(`Port ${port} is in use by another process. Please free it manually.`)
    process.exit(1)
  }
} catch {
  // if no listener remains, continue
}

process.exit(0)
