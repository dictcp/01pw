const express = require('express')
const next = require('next')
const vault = require('./modules/vault')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(express.json())

  server.get('/api/vaults', (req, res) => {
    res.send(JSON.stringify(vault.list()));
  })

  server.get('/api/vault', (req, res) => {
    var name = req.query.name
    res.send(JSON.stringify(vault.get(name)))
  })

  server.get('/api/secrets', (req, res) => {
    var name = req.query.name
    res.send(JSON.stringify(vault.listItems(name)))
  })

  server.post('/api/secret', (req, res) => {
    console.log(JSON.stringify(req.body))
    var name = req.body.vault
    var key = req.body.key
    res.send(vault.decrypt(name, key))
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
