/*
 * npm run ssh
 *
 * Abre una sesión SSH interactiva en el servidor usando las credenciales del
 * .env raíz. Despues de ingresar, verifica la estructura esperada:
 *   ls public_html/comured
 *   ls public_html/admin_comured
 *
 * Para chequeos no interactivos usa: npm run ssh -- "ls public_html"
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const SSH_IP = process.env.SSH_IP
const SSH_PORT = Number(process.env.SSH_PORT || 22)
const SSH_USERNAME = process.env.SSH_USERNAME
const SSH_PASSWORD = process.env.SSH_PASSWORD

if (!SSH_IP || !SSH_USERNAME || !SSH_PASSWORD) {
  console.error('Faltan SSH_IP / SSH_USERNAME / SSH_PASSWORD en el .env raíz.')
  process.exit(1)
}

async function main() {
  const Client = require('ssh2').Client
  const conn = new Client()

  const command = process.argv[2]

  await new Promise((resolve, reject) => {
    conn
      .on('ready', () => {
        if (command) {
          conn.exec(command, (err, stream) => {
            if (err) return reject(err)
            stream.on('close', (code) => {
              conn.end()
              process.exit(code ?? 0)
            })
            stream.on('data', (data) => process.stdout.write(data))
            stream.stderr.on('data', (data) => process.stderr.write(data))
          })
          return resolve()
        }

        // Interactive-ish shell via exec + stdin
        conn.shell({ term: 'xterm-256color' }, (err, stream) => {
          if (err) return reject(err)
          process.stdin.setEncoding('utf8')
          process.stdin.on('data', (d) => stream.write(d))
          process.stdin.setRawMode?.(true)
          stream.on('data', (d) => process.stdout.write(d))
          stream.stderr.on('data', (d) => process.stderr.write(d))
          stream.on('close', () => process.exit(0))
        })
        console.log('Sesión SSH abierta. Escribe comandos y "exit" para cerrar.')
        resolve()
      })
      .on('error', reject)
      .connect({ host: SSH_IP, port: SSH_PORT, username: SSH_USERNAME, password: SSH_PASSWORD })
  })
}

main()
  .catch((e) => {
    console.error('Error SSH:', e.message)
    process.exit(1)
  })
