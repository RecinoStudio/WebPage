const express = require('express'); const path = require('path'); const app = express(); const port = 3000;
// Servir archivos estáticos como el HTML y el JS
app.use(express.static(path.join(__dirname)));
// Ruta para el archivo index.html
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html'));
});
// Iniciar servidor
app.listen(port, () => { console.log(`Servidor escuchando en http://localhost:${port}`);
});
