const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const cors = require('cors'); // Importar CORS para habilitar solicitudes entre dominios

const app = express();
const port = 3000;

// Cargar la clave de API desde el archivo
let API_KEY = '';
try {
    API_KEY = fs.readFileSync('apikey.txt', 'utf-8').trim();
} catch (err) {
    console.error('Error al leer apikey.txt:', err.message);
    process.exit(1); // Termina el proceso si no se puede leer la API key
}

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta para obtener información del jugador
app.get('/player-info', async (req, res) => {
    const playerTag = req.query.tag;

    // Validar si el tag del jugador es proporcionado
    if (!playerTag) {
        return res.status(400).json({ error: 'El tag del jugador es obligatorio' });
    }

    console.log(`Consultando al jugador con tag: ${playerTag}`); // Agregar este log para saber qué jugador estamos buscando

    try {
        // Hacer la solicitud a la API de Brawl Stars
        const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            const errorDetails = await response.json(); // Obtener detalles adicionales del error
            console.error('Error en la API de Brawl Stars:', errorDetails); // Imprimir los detalles del error
            throw new Error(`Error en la API de Brawl Stars: ${response.status} - ${errorDetails.message || 'Sin detalles adicionales'}`);
        }

        // Obtener los datos del jugador
        const data = await response.json();
        console.log('Datos del jugador obtenidos:', data); // Mostrar los datos obtenidos en la consola

        // Enviar los datos como respuesta
        res.json(data);
    } catch (error) {
        // Manejo de cualquier error que ocurra en el proceso
        console.error('Error al obtener información del jugador:', error.message);
        res.status(500).json({ error: 'Error al obtener información del jugador' });
    }
});

// Iniciar servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});