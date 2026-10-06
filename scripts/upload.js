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
    remoteDir: 'public_html/comured',
    env: {},
  },
  admin: {
    cwd: path.join(__dirname, '..', 'admin-react'),
    command: 'npm run build',
    buildDir: path.join(__dirname, '..', 'api', 'public', 'admin', 'dist'),
    remoteDir: 'public_html/admin_comured',
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
  console.log(`\n▶ ${command}  (${path.basename(cwd)})`)
  const isWin = process.platform === 'win32'
  const res = spawnSync(isWin ? 'cmd.exe' : 'sh', isWin ? ['/c', command] : ['-c', command], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })
  if (res.status !== 0) {
    console.error(`Fallo: ${command} en ${cwd}`)
    process.exit(res.status ?? 1)
  }
}

async function uploadDir(sftp, localDir, remoteDir) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true })
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name)
    const remotePath = `${remoteDir}/${entry.name}`
    if (entry.isDirectory()) {
      await new Promise((res, rej) => sftp.mkdir(remotePath, (err) => (err && err.code !== 4 ? rej(err) : res())))
      await uploadDir(sftp, localPath, remotePath)
    } else {
      await new Promise((res, rej) => sftp.fastPut(localPath, remotePath, (err) => (err ? rej(err) : res())))
      console.log(`  ↑ ${path.relative(path.join(__dirname, '..'), localPath)} -> ${remotePath}`)
    }
  }
}

async function main() {
  const Client = require('ssh2').Client
  for (const t of targets) {
    const target = TARGETS[t]
    run(target.command, target.cwd, target.env)

    console.log(`\n⬆ Subiendo ${target.buildDir} -> ${target.remoteDir}`)
    await new Promise((resolve, reject) => {
      const conn = new Client()
      conn
        .on('ready', () => {
          conn.sftp(async (err, sftp) => {
            if (err) return reject(err)
            try {
              await uploadDir(sftp, target.buildDir, target.remoteDir)
              console.log(`✓ ${t} subido correctamente`)
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
  console.log('\n✓ Despliegue completado.')
}

main()
