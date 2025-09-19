const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3005
const API_BASE = process.env.API_BASE || 'http://localhost:4000'

app.get('/config', (req, res) => {
  res.json({ apiBase: API_BASE })
})

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log(`Simple dashboard serving on http://localhost:${PORT} (API_BASE=${API_BASE})`)
})
