const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// Crear aplicación Express
const app = express();
const port = 3000;

// Función asíncrona para leer la API Key de Brawl Stars
async function getApiKey() {
    try {
        const apiKey = await fs.readFile(path.join(__dirname, 'apikey.txt'), 'utf-8');
        return apiKey.trim();
    } catch (error) {
        console.error('Error al leer la API key:', error.message);
        throw new Error('No se pudo leer la API key');
    }
}

// Función para obtener jugadores del club
async function getClubMembers(clubTag, apiKey) {
    const response = await fetch(`https://api.brawlstars.com/v1/clubs/${encodeURIComponent(clubTag)}/members`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        }
    });

    if (!response.ok) throw new Error(`Error al obtener jugadores del club: ${response.status}`);
    const data = await response.json();
    return data.items;
}

// Función para obtener estadísticas de un jugador
async function getPlayerStats(playerTag, apiKey) {
    const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        }
    });

    if (!response.ok) throw new Error(`Error al obtener estadísticas del jugador: ${response.status}`);
    const data = await response.json();
    return data;
}

// Función para actualizar estadísticas de jugadores del club
async function updateClubStats() {
    const clubTag = '2UVURRLCC'; // Tag del club
    const apiKey = await getApiKey();

    try {
        const members = await getClubMembers(clubTag, apiKey);
        const playersStats = [];

        for (const member of members) {
            const playerTag = member.tag.replace('#', ''); // Quitar #
            const playerName = member.name;

            // Obtener estadísticas del jugador
            const playerStats = await getPlayerStats(playerTag, apiKey);

            const wins = playerStats.statistics.wins; // Obtener victorias
            playersStats.push({ name: playerName, tag: member.tag, wins });
        }

        console.log('Estadísticas del club actualizadas.');
        return playersStats; // Retorna las estadísticas
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error.message);
        return [];
    }
}

// Definir una ruta para obtener los jugadores
app.get('/players', async (req, res) => {
    try {
        const playersStats = await updateClubStats();
        res.json(playersStats); // Enviar datos de jugadores
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    setInterval(updateClubStats, 180000); // Actualizar estadísticas cada 3 minutos
});