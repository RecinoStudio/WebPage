const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const firebase = require('firebase/app');
require('firebase/database');
const app = express();
const port = 3000;

// Configuración de Firebase
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY', // Sustituir con tu propia API key
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com', // Sustituir con tu Project ID
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com', // Sustituir con tu URL de base de datos
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Servir archivos estáticos como el index.html y script.js
app.use(express.static(path.join(__dirname, 'public')));

// Función para leer la API Key desde el archivo apikey.txt
function getApiKey() {
    try {
        return fs.readFileSync('apikey.txt', 'utf-8').trim(); // Lee la API key
    } catch (error) {
        console.error('Error al leer la API key:', error.message);
        return null;
    }
}

// Función para obtener las estadísticas de un jugador desde la API de Brawl Stars
async function getPlayerStats(playerTag, API_KEY) {
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
    const playerRef = database.ref('players/' + playerTag);
    playerRef.set({
        name: playerName,
        trophies: trophies
    });
}

// Ruta para obtener los jugadores y sus estadísticas desde Firebase
app.get('/players', async (req, res) => {
    const API_KEY = getApiKey();
    if (!API_KEY) {
        return res.status(500).send('No se pudo obtener la API key');
    }

    const playerTag = 'PULVYRJUC'; // Tag del jugador
    try {
        const playerStats = await getPlayerStats(playerTag, API_KEY);
        const playerName = playerStats.name;
        const trophies = playerStats.trophies;

        // Guardar las estadísticas en Firebase
        savePlayerStatsToFirebase(playerTag, playerName, trophies);
        console.log(`Estadísticas de ${playerName} guardadas en Firebase.`);
        
        // Enviar datos de jugadores desde Firebase
        database.ref('players').once('value', (snapshot) => {
            const players = snapshot.val();
            res.json(players);
        });
    } catch (error) {
        console.error('Error al obtener estadísticas del jugador:', error.message);
        res.status(500).send('Error al obtener estadísticas');
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});