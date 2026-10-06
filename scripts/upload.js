/*
 * npm run upload [web|admin]
 *
 * Builds the selected app(s) (web/ and/or admin-react/) and uploads the
 * static output to Hostinger over SFTP using the variables in the root .env:
 *   SSH_IP, SSH_PORT, SSH_USERNAME, SSH_PASSWORD.
 *
 * Remote targets:
 *   web   -> public_html/comured/
 *   admin -> public_html/admin_comured/
 */
const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const SSH_IP = process.env.SSH_IP
const SSH_PORT = Number(process.env.SSH_PORT || 22)
const SSH_USERNAME = process.env.SSH_USERNAME
const SSH_PASSWORD = process.env.SSH_PASSWORD

if (!SSH_IP || !SSH_USERNAME || !SSH_PASSWORD) {
  console.error('Faltan SSH_IP / SSH_USERNAME / SSH_PASSWORD en el .env raíz.')
  process.exit(1)
}

const TARGETS = {
  web: {
    cwd: path.join(__dirname, '..', 'web'),
    command: 'npm run build',
    buildDir: path.join(__dirname, '..', 'web', 'out'),
    remoteDir: 'domains/appsennovaguajira.com/public_html/comured',
    env: {},
  },
  admin: {
    cwd: path.join(__dirname, '..', 'admin-react'),
    command: 'npm run build',
    buildDir: path.join(__dirname, '..', 'api', 'public', 'admin', 'dist'),
    remoteDir: 'domains/appsennovaguajira.com/public_html/admin_comured',
    // The admin subdomain serves the folder at '/', not '/admin/'.
    env: { VITE_BASE: '/' },
  },
}

const arg = process.argv[2]
const targets = arg && arg !== 'all' ? [arg] : Object.keys(TARGETS)

for (const t of targets) {
  if (!TARGETS[t]) {
    console.error(`Target desconocido: "${t}". Usa: npm run upload -- [web|admin]`)
    process.exit(1)
  }
}

function run(command, cwd, env) {
  console.log(col(`  ▶ ${command}  ${path.basename(cwd)}`, '36'))
  const isWin = process.platform === 'win32'
  const res = spawnSync(isWin ? 'cmd.exe' : 'sh', isWin ? ['/c', command] : ['-c', command], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })
  if (res.status !== 0) {
    console.error(col(`  ✗ Fallo: ${command} en ${cwd}`, '31'))
    process.exit(res.status ?? 1)
  }
}

function ensureDir(sftp, dir) {
  return new Promise((resolve, reject) => {
    sftp.mkdir(dir, () => resolve())
  })
}

async function ensurePath(sftp, remotePath) {
  const parts = remotePath.replace(/\/+$/, '').split('/')
  let current = ''
  for (const part of parts) {
    current = current ? `${current}/${part}` : part
    if (!current) continue
    await ensureDir(sftp, current)
  }
}

function collectFiles(localDir, remoteDir) {
  const results = []
  const stack = [{ local: localDir, remote: remoteDir }]
  while (stack.length) {
    const { local, remote } = stack.pop()
    for (const entry of fs.readdirSync(local, { withFileTypes: true })) {
      const localPath = path.join(local, entry.name)
      const remotePath = `${remote}/${entry.name}`
      if (entry.isDirectory()) stack.push({ local: localPath, remote: remotePath })
      else results.push({ local: localPath, remote: remotePath, size: fs.statSync(localPath).size })
    }
  }
  return results
}

function col(text, code) {
  return `[${code}m${text}[0m`
}

function progressBar(done, total) {
  const pct = Math.min(100, Math.round((done / total) * 100))
  const filled = Math.round((done / total) * 20)
  return col(`[${'▰'.repeat(filled)}${'▱'.repeat(20 - filled)}] ${pct}%`, '32')
}

async function uploadDir(sftp, localDir, remoteDir) {
  await ensurePath(sftp, remoteDir)
  const files = collectFiles(localDir, remoteDir)
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0)
  let doneBytes = 0
  let doneFiles = 0
  for (const file of files) {
    const remoteDirName = path.posix.dirname(file.remote)
    await ensureDir(sftp, remoteDirName)
    await new Promise((res, rej) => sftp.fastPut(file.local, file.remote, (err) => (err ? rej(err) : res())))
    doneBytes += file.size
    doneFiles += 1
    process.stdout.write(`\r  ${progressBar(doneBytes, totalBytes)}  ${doneFiles}/${files.length} archivos`)
  }
  process.stdout.write('\n')
}

async function main() {
  const Client = require('ssh2').Client
  for (const t of targets) {
    const target = TARGETS[t]
    run(target.command, target.cwd, target.env)

    console.log(col(`  ↑ Subiendo ${path.basename(target.buildDir)} -> ${target.remoteDir}`, '36'))
    await new Promise((resolve, reject) => {
      const conn = new Client()
      conn
        .on('ready', () => {
          conn.sftp(async (err, sftp) => {
            if (err) return reject(err)
            try {
              const cwd = await new Promise((res, rej) => sftp.realpath('.', (e, p) => (e ? rej(e) : res(p))))
              console.log(col(`  Remote cwd: ${cwd}`, '33'))
              await uploadDir(sftp, target.buildDir, target.remoteDir)
              console.log(col(`\n✓ ${t} subido correctamente`, '32'))
              conn.end()
              resolve()
            } catch (e) {
              reject(e)
            }
          })
        })
        .on('error', reject)
        .connect({
          host: SSH_IP,
          port: SSH_PORT,
          username: SSH_USERNAME,
          password: SSH_PASSWORD,
        })
    }).catch((e) => {
      console.error(`Error subiendo ${t}:`, e.message)
      process.exit(1)
    })
  }
  console.log(col('\n✓ Despliegue completado.', '32'))
  console.log(col(`  [${'▰'.repeat(20)}] 100%`, '32'))
}

main()
