const fetch = require('node-fetch'); const apiKey = 'YOUR_API_KEY'; // Sustituye con tu API Key const playerTag = 
'PULVYRJUC'; // Sustituye con el ID de jugador deseado async function fetchPlayerInfo() {
    const url = `https://api.brawlstars.com/v1/players/%23${playerTag}`; try { const response = await fetch(url, 
        {
            headers: { 'Authorization': `Bearer ${apiKey}`,
            },
        });
        if (!response.ok) { throw new Error('Error al obtener la información');
        }
        const data = await response.json();
        // Acceder a los datos del jugador
        const playerName = data.name; const trophies = data.trophies; const soloRanked = data.soloShowdownRank; 
        const duoRanked = data.duoShowdownRank;
        // Mostrar los datos en el HTML
        const playerInfoDiv = document.getElementById('player-info'); playerInfoDiv.innerHTML = ` <p>Nombre: 
            ${playerName}</p> <p>Troféos: ${trophies}</p> <p>Ranking en Solo: ${soloRanked}</p> <p>Ranking en 
            Duo: ${duoRanked}</p>
        `;
    } catch (error) {
        console.error('Error al obtener los datos:', error); document.getElementById('player-info').innerHTML = 
        `<p>Error al obtener la información del jugador.</p>`;
    }
}
fetchPlayerInfo();
