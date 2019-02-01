const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const apiKey = "key=B75674CAA3B45A36E8E42A201A48A540";
const partner = "&partner=0";
const getTopLiveMatch = "https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1/?";
const getRealTimeStats = "api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v001/?";
var app = express();

app.use(express.static(path.join(__dirname, '../dist/DOTA2VisLive')));
var heroRef = JSON.parse(fs.readFileSync('heroes.json', 'utf8'));

function parseGameObj(gameList){
  var gameObjects = {};
  var index = 0;
  for (index = 0; index < gameList.length; index++){
    var game = gameList[index];
    var gameObject = {};
    gameObject["serverSteamId"] = game["server_steam_id"];
    gameObject["gameTime"] = game["game_time"];
    gameObject["viewer"] = game["spectators"];
    gameObject["MMR"] = game["average_mmr"];
    gameObject["Pro"] = game["league_id"];
    gameObject["radiant"] = {
      "kills": game["radiant_score"],
      "heros": []
    };
    var i;
    for (i = 0; i < 5; i++){
      try {
        id = game["players"][i]["hero_id"];
        id = id.toString();
      } catch (error){
        console.log(error);
        id = 0;
      }
      name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
      img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
      gameObject["radiant"]["heros"].push({"name": name, "img": img});
    }
    gameObject["dire"] = {
      "kills": game["dire_score"],
      "heros":[]
    };
    for (i = 5; i < 10; i++){
      try {
        id = game["players"][i]["hero_id"];
        id = id.toString();
      } catch (error){
        console.log(error);
        console.log(game["players"]);
        id = 0;
      }
      name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
      img = (id > 0) ? heroRef[id]["img"]: 'assets/heroes/onPage/default.png';
      gameObject["dire"]["heros"].push({"name": name, "img": img});
    }
    gameObjects[index] = gameObject;
  }
  return gameObjects;
}

app.get('/liveMatches', function(req, res){
  request({
    uri: getTopLiveMatch+apiKey+partner,
    method: "GET",
    timeout: 100000
  }, function(response, body) {
    gameBrif = JSON.parse(body['body']);
    gameList = gameBrif["game_list"];
    gameObjects = parseGameObj(gameList);
    res.status(200).json(gameObjects);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/DOTA2VisLive/index.html'));
});
app.listen(4200);
