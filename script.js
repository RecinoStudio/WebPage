// Obtén la información del jugador desde el servidor
async function fetchPlayerInfo(playerTag) {
    try {
        const response = await fetch(`/player-info?tag=${playerTag}`);

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener información del jugador:', error.message);
        return null;
    }
}

// Renderiza la información del jugador en la página
async function renderPlayerInfo(playerTag) {
    const playerInfo = await fetchPlayerInfo(playerTag);

    if (playerInfo) {
        const playerSection = document.getElementById('player-info');
        playerSection.innerHTML = `
            <h2>Información del Jugador</h2>
            <p><strong>Nombre:</strong> ${playerInfo.name}</p>
            <p><strong>Trofeos:</strong> ${playerInfo.trophies}</p>
            <p><strong>Rango:</strong> ${playerInfo.expLevel}</p>
        `;
    } else {
        alert('Error al cargar información del jugador. Intenta nuevamente.');
    }
}

// Maneja la entrada del jugador y consulta la información
function handlePlayerInfo() {
    const playerTag = document.getElementById('player-tag').value.trim();
    
    if (playerTag) {
        renderPlayerInfo(playerTag);
    } else {
        alert('Por favor, ingresa un tag válido de jugador.');
    }
}

// Inicializa la página con un jugador por defecto
document.addEventListener('DOMContentLoaded', () => {
    // Aquí puedes definir un jugador por defecto o dejar vacío si prefieres solo consultar por entrada
    const defaultPlayerTag = ''; // Se deja vacío para no cargar nada por defecto
});