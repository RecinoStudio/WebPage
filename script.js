// URL de la base de datos de Firebase
const databaseURL = "https://juego-multijugador-45b97.firebaseio.com/";  // Usando tu ID de proyecto

// Reemplaza esto con tu propia API Key de Brawl Stars
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIwMWVmNmFjLWYzZmYtNGUwMy04M2M4LTE1NjNkM2U0YmVjMyIsImlhdCI6MTczMjM0MTYwMCwic3ViIjoiZGV2ZWxvcGVyLzA5NDcwZWU2LTM4NjgtNmQ1ZS0xZDQ2LTgxMGFjOWQxNDJhZCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTA0LjE5Ny40Mi42NSIsIjM0LjQ0LjEzMy4zIl0sInR5cGUiOiJjbGllbnQifV19.ZjZR_Yp_HpFwolJM5d_VBlnDDACnyjNTcq7Gkb6fl9pVCpzyb376s5AkDRoTacuiZV8LwxykPoXTO7QOqZsKFw";  // Sustituye con tu clave API

// Función para obtener estadísticas de un jugador desde la API de Brawl Stars
async function getPlayerStats(playerTag) {
    try {
        // El tag necesita el símbolo # al inicio
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener los datos del jugador');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las estadísticas de Brawl Stars:', error.message);
        return null;
    }
}

// Función para guardar las estadísticas del jugador en Firebase
function savePlayerStatsToFirebase(playerTag, playerName, trophies) {
    const playerRef = `${databaseURL}/players/${playerTag}.json`;
    const playerData = {
        name: playerName,
        trophies: trophies,
    };

    // Guardar datos en Firebase (método POST)
    fetch(playerRef, {
        method: 'PUT',  // Usamos PUT para reemplazar los datos si ya existen
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
    })
    .then(response => response.json())
    .then(() => {
        console.log(`Datos de ${playerName} guardados en Firebase.`);
    })
    .catch(error => {
        console.error('Error al guardar en Firebase:', error);
    });
}

// Función para mostrar las estadísticas del jugador en el HTML
async function displayPlayerStats() {
    const playerTag = 'PULVYRJUC';  // Reemplázalo con el tag del jugador que deseas consultar
    const playerStats = await getPlayerStats(playerTag);

    if (playerStats) {
        const playerName = playerStats.name;
        const trophies = playerStats.trophies;

        // Guardar los datos en Firebase
        savePlayerStatsToFirebase(playerTag, playerName, trophies);

        // Mostrar los datos en el HTML
        const playerInfoDiv = document.getElementById('player-info');
        playerInfoDiv.innerHTML = `
            <h2>Estadísticas de ${playerName}</h2>
            <p>Trophies: ${trophies}</p>
        `;
    } else {
        console.log('No se encontraron estadísticas para este jugador.');
    }
}

// Llamar a la función para mostrar las estadísticas del jugador
displayPlayerStats();