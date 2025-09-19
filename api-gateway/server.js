const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

// Backend target mapping - adapt if your services run on different ports
const targets = {
  blockchain: process.env.BLOCKCHAIN_URL || 'http://localhost:3001',
  geofence: process.env.GEOFENCE_URL || 'http://localhost:3002',
  ai: process.env.AI_URL || 'http://localhost:8090',
}

// Proxy helper
function proxy(pathPrefix, target, opts = {}) {
  const defaultRewrite = (pathReq) => pathReq.replace(new RegExp(`^${pathPrefix}`), '')

  app.use(pathPrefix, createProxyMiddleware(Object.assign({
    target,
    changeOrigin: true,
    pathRewrite: opts.pathRewrite || defaultRewrite,
    onProxyReq: (proxyReq, req, res) => {
      // forward real IP if available
      proxyReq.setHeader('X-Forwarded-For', req.ip || '')
    }
  }, opts.proxyOptions || {})))
}

// Routes to proxy
proxy('/blockchain', targets.blockchain)

// Geofence backend uses /geofence/* paths (e.g. /geofence/all, /geofence/create, /geofence/check)
// Map gateway-friendly endpoints to backend routes with pathRewrite where necessary.
// - GET /geofences           -> /geofence/all
// - POST /geofences          -> /geofence/create
// - GET/PUT/DELETE /geofences/:id -> /geofence/:id
// - POST /geofences/check    -> /geofence/check
// - POST /geofences/bulkCheck -> /geofence/bulkCheck
proxy('/geofences', targets.geofence, {
  pathRewrite: (pathReq, req) => {
    // Normalize incoming path
    const incoming = pathReq.replace(/^\/geofences/, '') || '/'

    // GET / -> /geofence/all
    if ((req.method === 'GET' || req.method === 'get') && (incoming === '/' || incoming === '')) return '/all'

    // POST / -> /create
    if ((req.method === 'POST' || req.method === 'post') && (incoming === '/' || incoming === '')) return '/create'

    // POST /check -> /check
    if ((req.method === 'POST' || req.method === 'post') && /^\/check/.test(incoming)) return incoming

    // POST /bulkCheck -> /bulkCheck
    if ((req.method === 'POST' || req.method === 'post') && /^\/bulkCheck/.test(incoming)) return incoming

    // /:id => /:id
    const idMatch = incoming.match(/^\/(.+)$/)
    if (idMatch) return `/${idMatch[1]}`

    // fallback: strip prefix
    return incoming
  }
})

proxy('/tourists', targets.blockchain) // assume blockchain hosts tourist registry endpoints
proxy('/emergency', targets.blockchain)
proxy('/ai', targets.ai)

// Serve API docs from docs/openapi.yaml
try {
  const specPath = path.join(__dirname, 'docs', 'openapi.yaml')
  const spec = yaml.load(fs.readFileSync(specPath, 'utf8'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
} catch (e) {
  console.warn('Could not load OpenAPI spec:', e.message)
}

// Health-check and simple gateway info
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sih-api-gateway', targets })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`)
})
