const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require("path");

app.use(express.static("../build"));

const APIKEY = "RGAPI-3d2686c1-a79d-41f8-85bd-a149125c3120";

app.get("/summoner/:username", (req, res) => {
  const summonerURL =
    "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    req.params.username +
    "?api_key=" +
    APIKEY;

  fetch(summonerURL)
    .then(response => response.json())
    .then(json => res.send({ json }))
    .catch(err => console.log(err));
});

app.get("/matches/:accountID", (req, res) => {
  const matchURL =
    "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
    req.params.accountID +
    "?api_key=" +
    APIKEY;

  fetch(matchURL)
    .then(response => response.json())
    .then(json => res.send({ json }))
    .catch(err => console.log(err));
});

app.get("/match/:matchId", (req, res) => {
  const matchURL =
    "https://na1.api.riotgames.com/lol/match/v4/matches/" +
    req.params.matchId +
    "?api_key=" +
    APIKEY;

  fetch(matchURL)
    .then(response => response.json())
    .then(json => res.send({ json }))
    .catch(err => console.log(err));
});

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

console.log("Running Node Express");
app.listen(8080);
