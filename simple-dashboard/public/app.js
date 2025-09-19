async function loadConfig() {
  const res = await fetch('/config')
  const cfg = await res.json()
  window.API_BASE = cfg.apiBase
  document.getElementById('info').textContent = `API base: ${window.API_BASE}`
}

function show(elId, obj) {
  document.getElementById(elId).textContent = JSON.stringify(obj, null, 2)
}

async function doGet(path, dest) {
  show(dest, { status: 'loading...' })
  try {
    const r = await fetch(window.API_BASE + path)
    const text = await r.text()
    // try to parse JSON
    try { show(dest, JSON.parse(text)) } catch (e) { show(dest, { status: r.status, body: text }) }
  } catch (e) {
    show(dest, { error: e.message })
  }
}

async function doPost(path, body, dest) {
  show(dest, { status: 'loading...' })
  try {
    const r = await fetch(window.API_BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const text = await r.text()
    try { show(dest, JSON.parse(text)) } catch (e) { show(dest, { status: r.status, body: text }) }
  } catch (e) { show(dest, { error: e.message }) }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig()

  document.getElementById('btn-geofences').addEventListener('click', () => doGet('/geofences', 'resp-get'))
  document.getElementById('btn-tourists').addEventListener('click', () => doGet('/tourists', 'resp-get'))
  document.getElementById('btn-incidents').addEventListener('click', () => doGet('/emergency/incidents', 'resp-get'))

  document.getElementById('btn-ai').addEventListener('click', () => {
    let payload
    try { payload = JSON.parse(document.getElementById('ai-payload').value) } catch (e) { show('resp-ai', { error: 'Invalid JSON' }); return }
    doPost('/ai/analyze', payload, 'resp-ai')
  })
})
