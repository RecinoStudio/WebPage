const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

// Inicialización de Express
const app = express();
const port = 3000;

// Leer la API Key de Brawl Stars desde el archivo 'apikey.txt'
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim();
} catch (error) {
    console.error('Error al leer la API key:', error.message);
    process.exit(1);
}

// Firebase Realtime Database URL
const FIREBASE_URL = 'https://juego-multijugador-45b97-default-rtdb.firebaseio.com/';

// Función para obtener jugadores del club de Brawl Stars
async function getClubMembers(clubTag) {
    try {
        const response = await fetch(`https://api.brawlstars.com/v1/clubs/${clubTag}/members`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            }
        });
        if (!response.ok) throw new Error(`Error al obtener jugadores del club: ${response.status}`);
        const data = await response.json();
        return data.items; // Retorna los jugadores
    } catch (error) {
        console.error('Error al obtener los jugadores del club:', error.message);
        return [];
    }
}

// Función para guardar un jugador en Firebase
async function savePlayerToFirebase(playerTag, playerName, wins) {
    try {
        const url = `${FIREBASE_URL}players/${playerTag}.json`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: playerName, wins })
        });
        if (!response.ok) throw new Error('Error al guardar jugador en Firebase');
        console.log(`Jugador ${playerName} guardado en Firebase.`);
    } catch (error) {
        console.error('Error al guardar jugador:', error.message);
    }
}

// Función para actualizar las estadísticas de los jugadores
async function updateClubStats() {
    const clubTag = '2UVURRLCC'; // Tag del club (cámbialo si es necesario)
    try {
        const members = await getClubMembers(clubTag);
        for (const member of members) {
            const playerTag = member.tag.replace('#', ''); // Eliminar el '#' del tag del jugador
            const playerName = member.name;
            const wins = Math.floor(Math.random() * 500); // Simulando victorias, cámbialo según lo necesites
            await savePlayerToFirebase(playerTag, playerName, wins);
        }
        console.log('Estadísticas del club actualizadas.');
    } catch (error) {
        console.error('Error al actualizar estadísticas del club:', error.message);
    }
}

// Configurar para actualizar cada 3 minutos (180,000 milisegundos)
setInterval(updateClubStats, 180000); // 3 minutos

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    updateClubStats(); // Primera actualización al iniciar
});