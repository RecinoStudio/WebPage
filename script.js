// Script para interactuar con la API de Brawl Stars

async function fetchPlayerStats() {
    const response = await fetch('/players');
    const data = await response.json();

    const playerStatsDiv = document.getElementById('playerStats');
    playerStatsDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Trophies:</strong> ${data.trophies}</p>
    `;
}

fetchPlayerStats();