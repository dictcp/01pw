const express = require('express')
const next = require('next')
const vault = require('./modules/vault')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/api/vault', (req, res) => {
    // req.query.vault
    res.send("not ready yet")
  })

  server.get('/api/secret', (req, res) => {
    res.send(vault.decrypt(req.query.vault, req.query.key))
  })

  // health-check
  server.get('/_healthz', (req, res) => {
    res.send('OK')
  })

  // built-in next.js page handling
  server.get('*', (req, res) => {
    handle(req, res)
  })

  server.listen(3000, err => {
    if (err) throw err;
  })
})
