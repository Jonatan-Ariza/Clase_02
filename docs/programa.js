// Inicializar el mapa
const mapa = L.map('mapa');

// Añadir capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// Cargar archivo GPX
const gpxLayer = new L.GPX("ruta.gpx", {
    async: true,
    marker_options: {
        startIconUrl: '',
        endIconUrl: '',
        shadowUrl: ''
    }
}).on('loaded', function(e) {
    mapa.fitBounds(e.target.getBounds());
}).addTo(mapa);

// Lista de imágenes con su hora (formato HH:MM:SS)
const imagenes = [
    { hora: "20:13:53", archivo: "3.jpg" },
    { hora: "20:15:51", archivo: "4.jpg" },
    { hora: "20:22:01", archivo: "5.jpg" },
    { hora: "20:22:01", archivo: "6.jpg" },
    { hora: "20:22:01", archivo: "7.jpg" },
    { hora: "20:22:01", archivo: "8.jpg" }
];

// Después que cargue la capa GPX, agregar marcadores con las imágenes
gpxLayer.on('loaded', function(e) {
    const layers = e.target.getLayers();

    layers.forEach(layer => {
        const puntos = layer.getLatLngs();
        const tiempos = layer._info?.track?.[0]?.coordTimes || [];

        puntos.forEach((punto, i) => {
            const time = tiempos[i];
            if (!time) return;

            const horaPunto = new Date(time).toTimeString().split(' ')[0];

            imagenes.forEach(img => {
                if (horaPunto.startsWith(img.hora)) {
                    L.marker(punto)
                        .addTo(mapa)
                        .bindPopup(`<img src="${img.archivo}" width="200">`);
                }
            });
        });
    });
});
