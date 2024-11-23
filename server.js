const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

// Crear aplicación Express
const app = express();
const port = 3000;

// Leer la API Key de Brawl Stars
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim(); // Lee la API key
} catch (error) {
    console.error('Error al leer la API key:', error.message);
    process.exit(1);
}

// Función para obtener jugadores del club
async function getClubMembers(clubTag) {
    const response = await fetch(`https://api.brawlstars.com/v1/clubs/${clubTag}/members`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        }
    });
    if (!response.ok) throw new Error(`Error al obtener jugadores del club: ${response.status}`);
    const data = await response.json();
    return data.items;
}

// Función para obtener estadísticas de un jugador
async function getPlayerStats(playerTag) {
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

// Función para actualizar estadísticas de jugadores del club
async function updateClubStats() {
    const clubTag = '2UVURRLCC'; // Tag del club
    try {
        const members = await getClubMembers(clubTag);
        const playersStats = [];

        for (const member of members) {
            const playerTag = member.tag.replace('#', ''); // Quitar #
            const playerName = member.name;

            // Obtener estadísticas del jugador
            const playerStats = await getPlayerStats(playerTag);

            const wins = playerStats.statistics.wins; // Obtener victorias
            playersStats.push({ name: playerName, tag: member.tag, wins });
        }

        console.log('Estadísticas del club actualizadas.');
        return playersStats; // Retorna las estadísticas
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error.message);
    }
}

// Definir una ruta para obtener los jugadores
app.get('/players', async (req, res) => {
    const playersStats = await updateClubStats();
    res.json(playersStats); // Enviar datos de jugadores
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    setInterval(updateClubStats, 180000); // Actualizar estadísticas cada 3 minutos
});