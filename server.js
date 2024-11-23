const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

// Leer la API Key de Brawl Stars
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim();
} catch (error) {
    console.error('Error al leer la API key:', error.message);
    process.exit(1);
}

// URL de tu base de datos Firebase
const FIREBASE_DB_URL = 'https://juego-multijugador-45b97-default-rtdb.firebaseio.com';

const app = express();
const port = 3000;

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

// Función para guardar jugadores en Firebase (usando REST API)
async function savePlayerToFirebase(playerTag, playerName, wins) {
    const playerData = { name: playerName, wins };
    const response = await fetch(`${FIREBASE_DB_URL}/players/${playerTag}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
    });

    if (!response.ok) throw new Error(`Error al guardar datos en Firebase: ${response.status}`);
    console.log(`Datos guardados: ${playerName}`);
}

// Actualizar estadísticas de jugadores del club
async function updateClubStats() {
    const clubTag = '2UVURRLCC'; // Tag del club
    try {
        const members = await getClubMembers(clubTag);
        for (const member of members) {
            const playerTag = member.tag.replace('#', ''); // Quitar #
            const playerName = member.name;

            // Aquí podrías obtener más estadísticas por jugador si es necesario
            const wins = Math.floor(Math.random() * 500); // Simular "wins"
            await savePlayerToFirebase(playerTag, playerName, wins);
        }
        console.log('Estadísticas del club actualizadas.');
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error.message);
    }
}

// Actualizar estadísticas cada 3 minutos
setInterval(updateClubStats, 180000);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    updateClubStats(); // Primera actualización al iniciar
});