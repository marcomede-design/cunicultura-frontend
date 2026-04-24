const fs = require('fs')

const keepAlive = `
// Keep alive - acorda o backend a cada 14 minutos
const BACKEND_URL = "https://cunicultura-backend.onrender.com"

function pingBackend() {
  fetch(BACKEND_URL + "/")
    .then(() => console.log("Backend acordado"))
    .catch(() => console.log("Ping falhou"))
}

// Inicia o ping após 14 minutos e repete
setInterval(pingBackend, 14 * 60 * 1000)
`

const api = fs.readFileSync('src/services/api.js', 'utf8')

if (!api.includes('setInterval')) {
  fs.writeFileSync('src/services/api.js', api + keepAlive, 'utf8')
  console.log('Keep alive adicionado ao api.js!')
} else {
  console.log('Keep alive ja existe!')
}