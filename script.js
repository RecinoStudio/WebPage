// Configurar Firebase (configura con tu información de Firebase)
const firebaseConfig = {
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIwMWVmNmFjLWYzZmYtNGUwMy04M2M4LTE1NjNkM2U0YmVjMyIsImlhdCI6MTczMjM0MTYwMCwic3ViIjoiZGV2ZWxvcGVyLzA5NDcwZWU2LTM4NjgtNmQ1ZS0xZDQ2LTgxMGFjOWQxNDJhZCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTA0LjE5Ny40Mi42NSIsIjM0LjQ0LjEzMy4zIl0sInR5cGUiOiJjbGllbnQifV19.ZjZR_Yp_HpFwolJM5d_VBlnDDACnyjNTcq7Gkb6fl9pVCpzyb376s5AkDRoTacuiZV8LwxykPoXTO7QOqZsKFw', // Sustituir con tu propia API key
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com', // Sustituir con tu Project ID
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com', // Sustituir con tu URL de base de datos
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Función para mostrar estadísticas en la página
async function displayPlayerStats() {
    const response = await fetch('/players');
    const players = await response.json();

    const playerInfoDiv = document.getElementById('player-info');
    if (!players) {
        playerInfoDiv.innerHTML = '<p>No se pudo obtener información de los jugadores.</p>';
        return;
    }

    const playersHtml = Object.keys(players).map(playerTag => {
        const player = players[playerTag];
        return `
            <div>
                <h2>${player.name}</h2>
                <p><strong>Tag:</strong> ${playerTag}</p>
                <p><strong>Trofeos:</strong> ${player.trophies}</p>
            </div>
        `;
    }).join('');

    playerInfoDiv.innerHTML = playersHtml;
}

// Llamar a la función para mostrar la información
displayPlayerStats();