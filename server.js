const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Carga la clave de API desde el archivo
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim();
} catch (err) {
    console.error('Error al leer apikey.txt:', err.message);
    process.exit(1);
}

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta para obtener información del jugador
app.get('/player-info', async (req, res) => {
    const playerTag = req.query.tag;

    if (!playerTag) {
        return res.status(400).json({ error: 'El tag del jugador es obligatorio' });
    }

    try {
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la API de Brawl Stars: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener información del jugador:', error.message);
        res.status(500).json({ error: 'Error al obtener información del jugador' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});