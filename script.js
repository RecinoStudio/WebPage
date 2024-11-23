<script type="module">
  // Cargar el SDK de Firebase v8 (CDN)
  import firebase from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
  import "https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js";

  // Configuración de Firebase (tuya, no necesitas cambiar la API Key aquí)
  const firebaseConfig = {
    apiKey: "AIzaSyBW-gAKIG7FNanxtur3h2aROaB9XNON40Y", // Esta es la API Key de tu proyecto Firebase, no la cambies aquí
    authDomain: "juego-multijugador-45b97.firebaseapp.com",
    databaseURL: "https://juego-multijugador-45b97-default-rtdb.firebaseio.com",
    projectId: "juego-multijugador-45b97",
    storageBucket: "juego-multijugador-45b97.firebasestorage.app",
    messagingSenderId: "182032480602",
    appId: "1:182032480602:web:8e7c94b002ec54f3641b63",
    measurementId: "G-VS7N0F3HF0"
  };

  // Inicializar Firebase con la configuración
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // Aquí colocas solo la API Key de Brawl Stars (no la de Firebase)
  const API_KEY_BRAWLSTARS = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIwMWVmNmFjLWYzZmYtNGUwMy04M2M4LTE1NjNkM2U0YmVjMyIsImlhdCI6MTczMjM0MTYwMCwic3ViIjoiZGV2ZWxvcGVyLzA5NDcwZWU2LTM4NjgtNmQ1ZS0xZDQ2LTgxMGFjOWQxNDJhZCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTA0LjE5Ny40Mi42NSIsIjM0LjQ0LjEzMy4zIl0sInR5cGUiOiJjbGllbnQifV19.ZjZR_Yp_HpFwolJM5d_VBlnDDACnyjNTcq7Gkb6fl9pVCpzyb376s5AkDRoTacuiZV8LwxykPoXTO7QOqZsKFw"; // Reemplaza con tu API key de Brawl Stars

  // Función para obtener estadísticas de un jugador
  async function getPlayerStats(playerTag) {
    const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY_BRAWLSTARS}`, // Usamos la API Key de Brawl Stars
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

  // Función para actualizar estadísticas del jugador
  async function updatePlayerStats() {
    const playerTag = 'PULVYRJUC'; // Tag del jugador, asegurate de colocar correctamente el tag
    try {
      const playerStats = await getPlayerStats(playerTag);
      const playerName = playerStats.name;
      const trophies = playerStats.trophies;

      // Guardar las estadísticas en Firebase
      savePlayerStatsToFirebase(playerTag, playerName, trophies);
      console.log(`Estadísticas de ${playerName} guardadas en Firebase.`);
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error.message);
    }
  }

  // Llamar a la función de actualización
  updatePlayerStats();
</script>