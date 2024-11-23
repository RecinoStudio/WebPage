const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const cors = require('cors'); // Importar CORS

const app = express();
const port = 3000;

// Cargar la clave de API desde el archivo
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim();
} catch (err) {
    console.error('Error al leer apikey.txt:', err.message);
    process.exit(1);
}

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Servir archivos estáticos (esto hará que el HTML y demás archivos estén disponibles)
app.use(express.static(path.join(__dirname)));

// Ruta para obtener información del jugador desde la API de Brawl Stars
app.get('/player-info', async (req, res) => {
    const playerTag = req.query.tag;

    if (!playerTag) {
        return res.status(400).json({ error: 'El tag del jugador es obligatorio' });
    }

    try {
        // Realizar la consulta a la API de Brawl Stars con el tag proporcionado
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error en la API de Brawl Stars: ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Enviar los datos al cliente
    } catch (error) {
        console.error('Error al obtener información del jugador:', error.message);
        res.status(500).json({ error: 'Error al obtener información del jugador' });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});