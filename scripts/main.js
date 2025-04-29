// scripts/main.js

const API_URL = "https://api.football-data.org/v4/competitions/";
const API_KEY = "9b2c1617f9f24be6b2a6cdce23371bc6"; // <-- Replace with your actual API key

// League codes according to football-data.org
const leagues = {
    ENG: "PL",       // Premier League
    SPA: "PD",       // La Liga (Primera Division)
    ITA: "SA",       // Serie A
    GER: "BL1",      // Bundesliga
    FRA: "FL1"       // Ligue 1
};

async function fetchLeagueStandings(leagueCode) {
    const response = await fetch(`${API_URL}${leagueCode}/standings`, {
        headers: {
            "X-Auth-Token": API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data for ${leagueCode}`);
    }

    const data = await response.json();
    return data.standings[0].table; // Typically the main league table
}

function renderTable(leagueId, standings) {
    const table = document.getElementById(`league-table-${leagueId}`);
    table.innerHTML = `
        <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Points</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
        </tr>
    `;

    standings.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.position}</td>
            <td><img src="${team.team.crest}" alt="${team.team.name}" width="20" height="20"> ${team.team.name}</td>
            <td>${team.points}</td>
            <td>${team.playedGames}</td>
            <td>${team.won}</td>
            <td>${team.draw}</td>
            <td>${team.lost}</td>
        `;
        table.appendChild(row);
    });
}

async function loadAllLeagues() {
    for (const [leagueId, leagueCode] of Object.entries(leagues)) {
        try {
            const standings = await fetchLeagueStandings(leagueCode);
            renderTable(leagueId, standings);
        } catch (error) {
            console.error(error);
            document.getElementById(`league-table-${leagueId}`).innerHTML = '<tr><td>Error loading data.</td></tr>';
        }
    }
}

// Start loading when page is ready
window.addEventListener('DOMContentLoaded', loadAllLeagues);
