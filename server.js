const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy para evitar CORS y adaptar la respuesta
app.get('/api/eventos', async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const apiUrl = 'http://192.168.5.53:8080/api/eventos/?format=json';
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Adaptar los datos al formato esperado por el frontend antiguo
    const adaptado = data.map(e => ({
      uuid: e.uuid,
      nombre: e.tipo?.nombre || '',
      tipo: e.tipo?.nombre || '',
      ubicacion: e.semaforo?.[0]?.direccion || e.street || '',
      zona: e.street || '',
      lat: e.latitud || '',
      lng: e.longitud || '',
      fecha: e.fecha_evento || '',
      descripcion: e.tipo?.descripcion || '',
      estado: e.semaforo?.[0]?.estado || '',
      creado: e.created || ''
    }));
    res.json(adaptado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
