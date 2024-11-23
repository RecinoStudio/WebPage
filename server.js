const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importamos CORS para permitir solicitudes externas

const app = express();
const port = 3000;

// Usamos CORS para permitir solicitudes de otros orígenes
app.use(cors());

// Función para leer la API Key desde apikey.txt
function getApiKey() {
    try {
        const apiKey = fs.readFileSync('apikey.txt', 'utf-8').trim();  // Lee la API key del archivo
        if (!apiKey) throw new Error('API Key no encontrada');
        console.log('API Key cargada correctamente');
        return apiKey;
    } catch (error) {
        console.error('Error al leer la API key:', error.message);
        return null;
    }
}

// Función para obtener las estadísticas de un jugador desde la API de Brawl Stars
async function getPlayerStats(playerTag, API_KEY) {
    try {
        console.log(`Obteniendo estadísticas para el jugador con tag: ${playerTag}`);
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            }
        });

        if (!response.ok) throw new Error(`Error al obtener estadísticas del jugador: ${response.status}`);
        
        const data = await response.json();
        console.log('Datos del jugador obtenidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener estadísticas del jugador:', error.message);
        throw error;
    }
}

// Ruta para obtener los jugadores y sus estadísticas desde Brawl Stars
app.get('/players', async (req, res) => {
    const API_KEY = getApiKey();
    if (!API_KEY) {
        console.error('No se pudo obtener la API key');
        return res.status(500).send('No se pudo obtener la API key');
    }

    const playerTag = 'PULVYRJUC'; // Tag del jugador
    try {
        const playerStats = await getPlayerStats(playerTag, API_KEY);
        const playerName = playerStats.name;
        const trophies = playerStats.trophies;

        // Devolver las estadísticas obtenidas del jugador
        console.log(`Estadísticas del jugador ${playerName} con ${trophies} trofeos`);
        res.json({
            name: playerName,
            trophies: trophies
        });
    } catch (error) {
        console.error('Error al obtener estadísticas del jugador:', error.message);
        res.status(500).send('Error al obtener estadísticas');
    }
});

// Servir archivos estáticos (index.html y script.js están en la raíz)
app.use(express.static(path.join(__dirname)));  // Esto servirá archivos desde la raíz

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});