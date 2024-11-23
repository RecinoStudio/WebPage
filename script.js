// Importar funciones necesarias de Firebase (v9 o superior)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIwMWVmNmFjLWYzZmYtNGUwMy04M2M4LTE1NjNkM2U0YmVjMyIsImlhdCI6MTczMjM0MTYwMCwic3ViIjoiZGV2ZWxvcGVyLzA5NDcwZWU2LTM4NjgtNmQ1ZS0xZDQ2LTgxMGFjOWQxNDJhZCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTA0LjE5Ny40Mi42NSIsIjM0LjQ0LjEzMy4zIl0sInR5cGUiOiJjbGllbnQifV19.ZjZR_Yp_HpFwolJM5d_VBlnDDACnyjNTcq7Gkb6fl9pVCpzyb376s5AkDRoTacuiZV8LwxykPoXTO7QOqZsKFw',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Función para obtener estadísticas de un jugador
async function getPlayerStats(playerTag) {
    const API_KEY = await fetch('apikey.txt').then(res => res.text()); // Leer la API key
    const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        }
    });

    if (!response.ok) throw new Error(`Error al obtener estadísticas del jugador: ${response.status}`);
    const data = await response.json();
    return data;
}

// Función para guardar estadísticas del jugador en Firebase
function savePlayerStatsToFirebase(playerTag, playerName, trophies) {
    const playerRef = ref(database, 'players/' + playerTag);
    set(playerRef, {
        name: playerName,
        trophies: trophies
    });
}

// Función para actualizar estadísticas del jugador
async function updatePlayerStats() {
    const playerTag = 'PULVYRJUC'; // Tag del jugador
    try {
        const playerStats = await getPlayerStats(playerTag);
        const playerName = playerStats.name;
        const trophies = playerStats.trophies;

        // Guardar las estadísticas en Firebase
        savePlayerStatsToFirebase(playerTag, playerName, trophies);
        console.log(`Estadísticas de ${playerName} guardadas en Firebase.`);
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error.message);
    }
}

// Llamar a la función de actualización
updatePlayerStats();