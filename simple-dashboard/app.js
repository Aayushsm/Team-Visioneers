/* Minimal dashboard client:
   - configure API bases
   - fetch /geofence/all and /blockchain/incidents
   - draw geofence polygons and incident markers on Leaflet map
   - create a sample geofence (POST /geofence/create)
   - update incident status (PUT /blockchain/incidents/:id)
*/

(() => {
  const els = {
    blockchainBase: document.getElementById('blockchainBase'),
    geofenceBase: document.getElementById('geofenceBase'),
    googleMapsKey: document.getElementById('googleMapsKey'),
    btnRefresh: document.getElementById('btnRefresh'),
    btnCreateSampleGeofence: document.getElementById('btnCreateSampleGeofence'),
    geofenceList: document.getElementById('geofenceList'),
    incidentList: document.getElementById('incidentList'),
    incidentFilter: document.getElementById('incidentFilter')
  };

  const map = L.map('map').setView([28.6139, 77.2090], 13);
  let baseLayer = null;

  function setBaseTileLayer(apiKey) {
    if (baseLayer) {
      try { map.removeLayer(baseLayer); } catch (e) { /* ignore */ }
      baseLayer = null;
    }

    const key = (apiKey || '').trim();
    if (key) {
      const url = `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${encodeURIComponent(key)}`;
      baseLayer = L.tileLayer(url, { subdomains: ['0','1','2','3'], attribution: '&copy; Google Maps' });
      baseLayer.addTo(map);
    } else {
      baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }
  }

  const geofenceLayer = L.geoJSON(null).addTo(map);
  const incidentLayer = L.layerGroup().addTo(map);

  async function fetchGeofences() {
    const base = (els.geofenceBase.value || '').replace(/\/+$/,'');
    if (!base) return [];
    try {
      const res = await fetch(`${base}/geofence/all`);
      if (!res.ok) throw new Error(`status:${res.status}`);
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.error('fetchGeofences', e);
      return [];
    }
  }

  async function fetchIncidents() {
    const base = (els.blockchainBase.value || '').replace(/\/+$/,'');
    if (!base) return [];
    try {
      const res = await fetch(`${base}/blockchain/incidents?limit=100`);
      if (!res.ok) throw new Error(`status:${res.status}`);
      const json = await res.json();
      return json.data || json;
    } catch (e) {
      console.error('fetchIncidents', e);
      return [];
    }
  }

  function clearUI() {
    els.geofenceList.innerHTML = '';
    els.incidentList.innerHTML = '';
    geofenceLayer.clearLayers();
    incidentLayer.clearLayers();
  }

  function renderGeofences(list) {
    els.geofenceList.innerHTML = '';
    geofenceLayer.clearLayers();
    list.forEach(g => {
      const li = document.createElement('li');
      li.textContent = `${g.name || g._id || 'zone'} — ${g.zoneType || 'unknown'}`;
      els.geofenceList.appendChild(li);

      const geo = g.polygon || g.geometry || g.geojson;
      if (geo && geo.type) {
        const style = { color: (g.zoneType === 'danger') ? '#c0392b' : (g.zoneType === 'safe' ? '#27ae60' : '#f39c12'), weight:2, fillOpacity:0.12 };
        const layer = L.geoJSON(geo, { style }).bindPopup(`<strong>${g.name || 'Zone'}</strong><br/>${g.description || ''}`);
        layer.addTo(geofenceLayer);
      }
    });
    if (geofenceLayer.getBounds().isValid()) {
      map.fitBounds(geofenceLayer.getBounds(), { maxZoom: 16 });
    }
  }

  function renderIncidents(list) {
    els.incidentList.innerHTML = '';
    incidentLayer.clearLayers();
    const filter = els.incidentFilter.value;
    list.filter(i => (filter === 'all') ? true : (i.eventType === filter)).forEach(i => {
      const li = document.createElement('li');
      const when = new Date(i.timestamp || i.createdAt || Date.now()).toLocaleString();
      li.innerHTML = `<strong>[${(i.eventType||'event').toUpperCase()}]</strong> ${i.description || ''}<br/><small>${when} — severity: ${i.severity || 'n/a'}</small>`;
      const btnRow = document.createElement('div');
      btnRow.className = 'btn-row';

      const btnInProgress = document.createElement('button');
      btnInProgress.textContent = 'In-Progress';
      btnInProgress.onclick = () => updateIncidentStatus(i.incidentId || i._id || i.id, 'in-progress');

      const btnResolve = document.createElement('button');
      btnResolve.textContent = 'Resolve';
      btnResolve.onclick = () => updateIncidentStatus(i.incidentId || i._id || i.id, 'resolved');

      btnRow.appendChild(btnInProgress);
      btnRow.appendChild(btnResolve);
      li.appendChild(btnRow);
      els.incidentList.appendChild(li);

      const loc = i.location || i.coordinates || (i.metadata && i.metadata.location);
      let lat, lng;
      if (loc) {
        lat = loc.lat || loc.latitude || (Array.isArray(loc) ? loc[1] : undefined);
        lng = loc.lng || loc.longitude || (Array.isArray(loc) ? loc[0] : undefined);
      }
      if (lat && lng) {
        const m = L.marker([lat, lng]).bindPopup(`<strong>${i.eventType}</strong><br/>${i.description || ''}<br/><small>${when}</small>`);
        m.addTo(incidentLayer);
      }
    });
    if (!geofenceLayer.getLayers().length && incidentLayer.getBounds().isValid()) {
      map.fitBounds(incidentLayer.getBounds(), { maxZoom: 16 });
    }
  }

  async function updateIncidentStatus(incidentId, status) {
    const base = (els.blockchainBase.value || '').replace(/\/+$/,'');
    if (!incidentId) return alert('No incident id');
    try {
      const res = await fetch(`${base}/blockchain/incidents/${incidentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`status:${res.status}`);
      alert(`Incident ${incidentId} -> ${status}`);
      await refreshAll();
    } catch (e) {
      console.error('updateIncidentStatus', e);
      alert('Failed to update incident (see console)');
    }
  }

  async function createSampleGeofence() {
    const base = (els.geofenceBase.value || '').replace(/\/+$/,'');
    const sample = {
      name: "Demo Danger Zone",
      description: "Created from simple dashboard",
      polygon: {
        type: "Polygon",
        coordinates: [
          [
            [77.2000,28.6100],
            [77.2150,28.6100],
            [77.2150,28.6250],
            [77.2000,28.6250],
            [77.2000,28.6100]
          ]
        ]
      },
      zoneType: "danger",
      severity: "high",
      createdBy: "authority-demo"
    };
    try {
      const res = await fetch(`${base}/geofence/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      });
      if (!res.ok) throw new Error(`status:${res.status}`);
      alert('Sample geofence created');
      await refreshAll();
    } catch (e) {
      console.error('createSampleGeofence', e);
      alert('Failed to create geofence (see console)');
    }
  }

  async function refreshAll() {
    try {
      setBaseTileLayer(els.googleMapsKey.value);
    } catch (e) {
      console.warn('Failed to set tile layer with provided key, falling back to OSM', e);
      setBaseTileLayer('');
    }

    clearUI();
    const [geofences, incidents] = await Promise.all([fetchGeofences(), fetchIncidents()]);
    renderGeofences(geofences || []);
    renderIncidents(incidents || []);
  }

  els.btnRefresh.addEventListener('click', refreshAll);
  els.btnCreateSampleGeofence.addEventListener('click', createSampleGeofence);
  els.incidentFilter.addEventListener('change', refreshAll);
  els.googleMapsKey.addEventListener('keydown', (e) => { if (e.key === 'Enter') refreshAll(); });

  setBaseTileLayer(els.googleMapsKey.value);
  refreshAll();

  window._simpleDashboard = { refreshAll, fetchGeofences, fetchIncidents };
})();