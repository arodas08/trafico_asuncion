
let chart;

async function obtenerEventos() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const zone = document.getElementById('zoneSelect').value;
  const type = document.getElementById('incidentType').value;

  const lista = document.getElementById('resultadoLista');
  const noResult = document.getElementById('noResult');
  lista.innerHTML = '';
  noResult.classList.add('hidden');

  try {
    const response = await fetch('http://192.168.5.53:8080/api/eventos/?format=json');
    const data = await response.json();

    const eventosFiltrados = data.filter(e => {
      const matchQuery = !query || (e.nombre?.toLowerCase().includes(query) || e.ubicacion?.toLowerCase().includes(query));
      const matchZone = !zone || (e.zona && e.zona === zone);
      const matchType = !type || (e.tipo && e.tipo === type);
      return matchQuery && matchZone && matchType;
    });

    if (eventosFiltrados.length === 0) {
      noResult.classList.remove('hidden');
    }

    eventosFiltrados.forEach(e => {
      const li = document.createElement('li');
      li.className = 'p-4 border rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center';

      const title = document.createElement('div');
      title.innerHTML = `<strong>${e.nombre}</strong><br><span class="text-sm text-gray-600">${e.ubicacion} - ${e.zona || ''}</span><br><span class="text-sm text-gray-500">${e.tipo || ''}</span>`;

      const link = document.createElement('a');
      link.href = `https://waze.com/ul?ll=${e.lat},${e.lng}&navigate=yes`;
      link.target = '_blank';
      link.className = 'mt-2 md:mt-0 md:ml-4 text-blue-700 hover:underline';
      link.innerHTML = '<i class="fas fa-location-arrow mr-1"></i> Ver en Waze';

      li.appendChild(title);
      li.appendChild(link);
      lista.appendChild(li);
    });

    actualizarGrafico(data);

  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    alert('No se pudo conectar con la API. Asegúrese de que esté en línea.');
  }
}

function actualizarGrafico(eventos) {
  const conteo = {};
  eventos.forEach(e => {
    const tipo = e.tipo || 'Otro';
    conteo[tipo] = (conteo[tipo] || 0) + 1;
  });

  const tipos = Object.keys(conteo);
  const cantidades = Object.values(conteo);

  const ctx = document.getElementById('chartIncidentes').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Cantidad de Incidentes',
        data: cantidades,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.getElementById('searchBtn').addEventListener('click', obtenerEventos);
document.getElementById('refreshBtn').addEventListener('click', obtenerEventos);
window.addEventListener('DOMContentLoaded', obtenerEventos);
