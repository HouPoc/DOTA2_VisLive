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
  var matchDetail = raw_gameDetail.match;
  var teams = raw_gameDetail["teams"];
  var buildings = raw_gameDetail["buildings"];
  var graph_data = raw_gameDetail["graph_data"];
  //console.log(raw_gameDetail); 
  console.log(matchDetail);
  //console.log(teams);
  //console.log(buildings);
  //console.log(graph_data);
  gameDetail["time"] = matchDetail["game_time"];
  gameDetail["picks"] = {"radiant": [], "dire": []};
  gameDetail["bans"] = {"radiant": [], "dire": []};

  if ("bans" in matchDetail){
    for (i = 0; i < 12; i++){
      try {
        ban = matchDetail["bans"][i];
        id = ban["hero"];
        id = id.toString();
      } catch (error){
        console.log("No Bans or Hero ID is not in dataset in finding bans");
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
  }
  gameDetail["radiant"] = {};
  gameDetail["dire"] = {};

  gameDetail["radiant"]["score"] = teams[0]["score"];
  gameDetail["radiant"]["netWorth"] = teams[0]["new_worth"];
  RPs = teams[0]["players"];
  for (i = 0; i < 5; i++){
    id = RPs[i]["heroid"];
    delete RPs[i]["accountid"];
    delete RPs[i]["playerid"];
    delete RPs[i]["heroid"];
    delete RPs[i]["team"];
    name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
    img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
    icon = (id > 0) ? heroRef[id]["icon"] : 'assets/heroes/onMap/axe.png';
    gameDetail["picks"]["radiant"].push({"name": name, "img": img, "icon": icon})
  }
  gameDetail["radiant"]["players"] = RPs;


  gameDetail["dire"]["score"] = teams[1]["score"];
  gameDetail["dire"]["netWorth"] = teams[1]["new_worth"];
  DPs = teams[1]["players"];
  for (i = 0; i < 5; i++){
    id = DPs[i]["heroid"];
    delete DPs[i]["accountid"];
    delete DPs[i]["playerid"];
    delete DPs[i]["heroid"];
    delete DPs[i]["team"];
    name = (id > 0) ? heroRef[id]["localized_name"] : 'Not Defined';
    img = (id > 0) ? heroRef[id]["img"] : 'assets/heroes/onPage/default.png';
    icon = (id > 0) ? heroRef[id]["icon"] : 'assets/heroes/onMap/axe.png';
    gameDetail["picks"]["dire"].push({"name": name, "img": img, "icon": icon})
  }
  gameDetail["dire"]["players"] = DPs;
  gameDetail["radiant"]["buildings"] = {};
  gameDetail["dire"]["buildings"] = {};

  gameDetail["radiant"]["buildings"][0] =  Array(8).fill(1); // L1 + L2 + L3 + H(towers) 3 + 3 + 3 + 2 = 11
  gameDetail["radiant"]["buildings"][1] =  Array(6).fill(1); // Barracks 6
  gameDetail["radiant"]["buildings"][2] =  Array(1).fill(1); // Base 1

  gameDetail["dire"]["buildings"][0] =  Array(8).fill(1); // L1 + L2 + L3 + H(towers)
  gameDetail["dire"]["buildings"][1] =  Array(6).fill(1); // Barracks
  gameDetail["dire"]["buildings"][2] =  Array(1).fill(1); // Base
  numBuildings = buildings.length; 

  if ( numBuildings != 2){ 
    // # of tower = 11
    for (i = 0; i < 11; i++){
      gameDetail["radiant"]["buildings"][0][i] = buildings[i]["destroyed"] == true? 0 : 1;  
      gameDetail["dire"]["buildings"][0][i] = buildings[i+18]["destroyed"] == true? 0 : 1; 
    }
    // # of Barracks = 6
    for (i = 11; i < 11+6; i++){
      gameDetail["radiant"]["buildings"][1][i - 11] = buildings[i]["destroyed"] == true? 0 : 1;  
      gameDetail["dire"]["buildings"][1][i - 11] = buildings[i+18]["destroyed"] == true? 0 : 1; 
    } 
    // # of Base = 1
    gameDetail["radiant"]["buildings"][2][0] = buildings[17]["destroyed"] == true? 0 : 1;  
    gameDetail["dire"]["buildings"][2][0] = buildings[35]["destroyed"] == true? 0 : 1; 
  }   
  gameDetail["worth_graph"] =graph_data["graph_gold"];
  return gameDetail;
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
    //console.log(serverResponse);
    gameDetail_raw = JSON.parse(serverResponse)
    gameDetail = parseRawGameDetail(gameDetail_raw);
    res.status(200).send(gameDetail);
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/DOTA2VisLive/index.html'));
});
app.listen(52367);
