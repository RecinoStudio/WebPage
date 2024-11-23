const express = require('express');
const fetch = require('node-fetch');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<your-database-name>.firebaseio.com'
});
const db = admin.database();

// Crear la aplicación Express
const app = express();
const port = 3000;

// Leer la API Key desde el archivo apikey.txt
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim(); // Lee la clave de la API
} catch (err) {
    console.error('Error al leer apikey.txt:', err.message);
    process.exit(1); // Termina el proceso si no se puede leer la API key
}

// Función para obtener los jugadores del club
async function getClubMembers(clubTag) {
    const response = await fetch(`https://api.brawlstars.com/v1/clubs/${clubTag}/members`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error al obtener los jugadores del club: ${response.status}`);
    }

    const data = await response.json();
    return data.items; // Devuelve la lista de jugadores
}

// Función para obtener estadísticas de un jugador
async function getPlayerStats(playerTag) {
    const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error al obtener las estadísticas del jugador: ${response.status}`);
    }

    const data = await response.json();
    return data; // Devuelve los datos del jugador
}

// Función para guardar datos del jugador en Firebase
function savePlayerStatsToFirebase(playerTag, playerName, wins) {
    const playerRef = db.ref('players').child(playerTag);
    playerRef.set({
        name: playerName,
        wins: wins
    })
    .then(() => {
        console.log(`Datos de ${playerName} guardados exitosamente.`);
    })
    .catch((error) => {
        console.error('Error al guardar los datos del jugador:', error);
    });
}

// Función para actualizar los datos de los jugadores del club
async function updateClubStats() {
    const clubTag = '2UVURRLCC'; // El tag del club (esto lo puedes personalizar)

    try {
        // Obtener los miembros del club
        const members = await getClubMembers(clubTag);

        for (const member of members) {
            const playerTag = member.tag;
            const playerName = member.name;

            // Obtener las estadísticas del jugador
            const playerStats = await getPlayerStats(playerTag);

            // Guardar las estadísticas del jugador en Firebase
            const wins = playerStats.statistics.wins;
            savePlayerStatsToFirebase(playerTag, playerName, wins);
        }

        console.log('Datos del club actualizados correctamente');
    } catch (error) {
        console.error('Error al actualizar los datos del club:', error);
    }
}

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);

    // Actualizar los datos del club al iniciar el servidor
    updateClubStats();

    // Configurar para actualizar cada 5 minutos (300,000 milisegundos)
    setInterval(updateClubStats, 300000); // 5 minutos
});