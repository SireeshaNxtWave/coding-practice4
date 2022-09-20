const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
        * 
    FROM 
        cricket_team
    ORDER BY
        player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  const convertDbObjectToResponseObject = (element) => {
    return {
      playerId: playerArray.player_id,
      playerName: playerArray.player_name,
      jerseyNumber: playerArray.jersey_number,
      role: playerArray.role,
    };
  };
  const result = playerArray.forEach((element) => {
    convertDbObjectToResponseObject(element);
  });
  response.send(result);
});

app.post("/players/", async (request, response) => {
  const postPlayerQuery = `
    INSERT INTO 
        cricket_team (player_name, jersey_number, role)
    VALUES
        ("vishal", "17", "Bowler");`;
  await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerQuery = `
     UPDATE
       cricket_team
     SET
        "player_name": "Maneesh",
        "jersey_number": 54,
        "role": "All-rounder"
     WHERE 
        player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM 
            cricket_team
        WHERE
            player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
