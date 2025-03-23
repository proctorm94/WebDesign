const API_KEY = "9b2c1617f9f24be6b2a6cdce23371bc6"; // Replace with your actual API key
const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // CORS Anywhere proxy URL
const API_URL = "https://api.football-data.org/v4/competitions";

const leagues = {
    ENG: "PL",   // Premier League
    SPA: "PD",   // La Liga
    ITA: "SA",   // Serie A
    GER: "BL1",  // Bundesliga
    FRA: "FL1"   // Ligue 1
};

// Function to fetch league standings
async function fetchLeagueStandings(leagueCode, tableId) {
    try {
        const response = await fetch(`${PROXY_URL}${API_URL}/${leagueCode}/standings`, {
            headers: { "X-Auth-Token": API_KEY }
        });

        if (!response.ok) throw new Error(`Failed to fetch ${leagueCode} standings`);

        const data = await response.json();
        const standings = data.standings[0].table; // Get the league table

        // Populate the league table
        const table = document.getElementById(tableId);
        table.innerHTML = `
            <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Points</th>
                <th>Played</th>
            </tr>
        `;

        standings.forEach(team => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${team.position}</td>
                <td><img src="${team.team.crest}" width="20"> ${team.team.name}</td>
                <td>${team.points}</td>
                <td>${team.playedGames}</td>
            `;
            table.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        document.getElementById(tableId).innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
    }
}

// Load all leagues when the page loads
document.addEventListener("DOMContentLoaded", () => {
    for (const [tableId, leagueCode] of Object.entries(leagues)) {
        fetchLeagueStandings(leagueCode, `league-table-${tableId}`);
    }
});
