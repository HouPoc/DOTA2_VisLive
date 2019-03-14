const express = require('express');
const request = require('request');
const requestS = require('sync-request');

const lossLessJSON = require('lossless-json');
const path = require('path');
const fs = require('fs');
const apiKey = "key=B75674CAA3B45A36E8E42A201A48A540";
const partner = "&partner=1";
const getTopLiveMatch = "https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1/?";
const getRealTimeStats = "https://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v001/?";
var app = express();

app.use(express.static(path.join(__dirname, '../dist/DOTA2VisLive')));
var heroRef = JSON.parse(fs.readFileSync('heroes.json', 'utf8'));


function parseGameObj(gameList, gameListServerSteamId){
  //console.log(gameList);
  var gameObjects = [];
  var index = 0;
  for (index = 0; index < 5; index++){

    var game = gameList[index];
    var gameServerSteamId = gameListServerSteamId[index];
    var gameObject = {};
    gameObject["serverSteamId"] = gameServerSteamId.server_steam_id.value;
    gameObject["gameTime"] = game["game_time"];
    gameObject["viewer"] = game["spectators"];
    gameObject["MMR"] = game["average_mmr"];
    gameObject["Pro"] = game["league_id"];
    gameObject["radiant"] = {
      "kills": game["radiant_score"],
      "heroes": []
    };
    gameObject["dire"] = {
      "kills": game["dire_score"],
      "heroes":[]
    };

    resquestUrl = getRealTimeStats+apiKey+"&server_steam_id="+gameServerSteamId.server_steam_id.value;
    var res = requestS('GET', resquestUrl);
    tmp = JSON.parse(res.getBody('utf-8'));
    radiantTeam = [];
    for (i =0 ; i < 5; i++){
      radiantTeam.push(tmp["teams"][0]["players"][i]["accountid"]);
    }
    //console.log(game);

    var i;
    for (i = 0; i < game["players"].length; i++){
      try {
        id = game["players"][i]["hero_id"];
        id = id.toString();
      } catch (error){
        //console.log(error);
        id = 0;
      }
      name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
      img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
      if (radiantTeam.indexOf(game["players"][i]["account_id"]) > -1){
        gameObject["radiant"]["heroes"].push({"name": name, "img": img});
      }else {
        gameObject["dire"]["heroes"].push({"name": name, "img": img});
      }
    }
    gameObjects.push(gameObject);
  }
  return gameObjects;
}

function parseRawGameDetail(raw_gameDetail){
  var gameDetail = {};
  var match = raw_gameDetail["match"];
  gameDetail["time"] = match["game_time"];
  gameDetail["picks"] = {"radiant": [], "dire": []};
  gameDetail["bans"] = {"radiant": [], "dire": []};
  for (i = 0; i < 10; i++){
    pick = match["picks"][i];
    try {
      id = pick["hero"];
      id = id.toString();
    } catch (error){
      //console.log(error);
      id = 0;
    }
    name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
    img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
    icon = (id > 0) ? heroRef[id]["icon"] : 'assets/heroes/onMap/default.png';
    if (pick["team"] == 2){
      gameDetail["picks"]["radiant"].push({"name": name, "img": img, "icon": icon})
    }
    else {
      gameDetail["picks"]["dire"].push({"name": name, "img": img, "icon": icon})
    }
  }
  for (i = 0; i < 12; i++){
    ban = match["bans"][i];
    try {
      id = ban["hero"];
      id = id.toString();
    } catch (error){
      //console.log(error);
      id = 0;
    }
    name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
    img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
    if (pick["team"] == 2){
      gameDetail["bans"]["radiant"].push({"name": name, "img": img})
    }
    else {
      gameDetail["bans"]["dire"].push({"name": name, "img": img})
    }
  }
  gameDetail["radiant"] = {};
  gameDetail["dire"] = {};

  gameDetail["radiant"]["score"] = match["team"][0]["score"];
  gameDetail["radiant"]["netWorth"] = match["team"][0]["new_worth"];
  gameDetail["radiant"]["players"] = match["team"][0]["players"];
  gameDetail["radiant"]["buildings"]


  gameDetail["dire"]["score"] = match["team"][1]["score"];
  gameDetail["dire"]["netWorth"] = match["team"][1]["new_worth"];
  gameDetail["dire"]["players"] = match["team"][1]["players"];

  gameDetail["worth_graph"] = match["graph_data"]["graph_gold"];
}


app.get('/liveMatches', function(req, res){
  request({
    uri: getTopLiveMatch+apiKey+partner,
    method: "GET",
    timeout: 100000
  }, function(response, body) {

    gameBrif = body["body"];
    gameList = JSON.parse(gameBrif);
    gameListServerSteamId = lossLessJSON.parse(gameBrif);
    gameObjects = parseGameObj(gameList["game_list"], gameListServerSteamId["game_list"]);
    res.status(200).send(gameObjects);
  });
});

app.get('/matchDetail/:server_steam_id', function(req, res){
  var SSD = 'server_steam_id='+req.params.server_steam_id;
  request({
    uri: getRealTimeStats+SSD+'&'+apiKey,
    method: 'GET',
    timeout: 100000
  }, function(response, body){
    serverResponse = body["body"];
    console.log(serverResponse)
    raw_gameDetail = JSON.parse(serverResponse);
    gameDetail = parseRawGameDetail(raw_gameDetail);
    res.status(200).send(gameDetail);
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/DOTA2VisLive/index.html'));
});
app.listen(52367);
