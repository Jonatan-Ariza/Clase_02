document.addEventListener('DOMContentLoaded', async function () {
  const mapa = L.map('mapa');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapa);

  const gpxText = await fetch('ruta.gpx').then(res => res.text());
  const parser = new DOMParser();
  const gpxDoc = parser.parseFromString(gpxText, 'application/xml');
  const trkpts = gpxDoc.getElementsByTagName('trkpt');

  const coords = [];

  // Diccionario de horas de fotos mapeadas a sus imágenes
  const horaImagenes = {
    "2024-08-05T14:00:00Z": "imagenes/1.jpg",
    "2024-08-05T14:05:00Z": "imagenes/2.jpg",
    "2024-08-05T14:10:00Z": "imagenes/3.jpg"
  };

  for (let i = 0; i < trkpts.length; i++) {
    const trkpt = trkpts[i];
    const lat = parseFloat(trkpt.getAttribute('lat'));
    const lon = parseFloat(trkpt.getAttribute('lon'));
    coords.push([lat, lon]);

    const timeTag = trkpt.getElementsByTagName('time')[0];
    if (timeTag) {
      const time = timeTag.textContent.trim();
      if (horaImagenes[time]) {
        const marker = L.marker([lat, lon]).addTo(mapa);
        marker.bindPopup(`<img src="${horaImagenes[time]}" alt="Imagen tomada a las ${time}" width="200">`);
      }
    }
  }

  if (coords.length > 0) {
    const linea = L.polyline(coords, { color: 'blue' }).addTo(mapa);
    mapa.fitBounds(linea.getBounds());
  }
});
