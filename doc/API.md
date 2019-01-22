# API Design Documention for DOTA2 VisLive

## STEAM (Retrieve data from DOTA2 Server)
   * GET `/IDOTA2Match_570/GetTopLiveGame/v1/`
     * Usage
       * `http://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1/?key=xxx&partner=xxx`
       
     * Description
        * API from STEAM to get brief game status summaries of live game in DOTA2 TV
        * This API is basically used to get __server\_steam\_id__ to get live stats of match in that server
        
     * Parameter
        * key (32-bit STEAM auth key)
        * partner (default is 0, can be chosen from 0, 1, 2, 3)
     
     * Return
        * It will return a JSON object with an array called `game_list`. It contains 10 objects that are summaries of top 10 live games.
          Here is a sample return data:
          ```json
            {
              "game_list": [
                {
                  "activate_time": 1548061568,
                  "deactivate_time": 0,
                  "server_steam_id": 90122807807804416,
                  "lobby_id": 25971364377278231,
                  "league_id": 10482,
                  "lobby_type": 1,
                  "game_time": 765,
                  "delay": 300,
                  "spectators": 4725,
                  "game_mode": 2,
                  "average_mmr": 0,
                  "match_id": 4350011381,
                  "series_id": 288548,
                  "team_name_radiant": "Virtus.pro",
                  "team_name_dire": "Evil Geniuses",
                  "team_logo_radiant": 960848925858468291,
                  "team_logo_dire": 142255738559146189,
                  "team_id_radiant": 1883502,
                  "team_id_dire": 39,
                  "sort_score": 13725,
                  "last_update_time": 1548062080,
                  "radiant_lead": 0,
                  "radiant_score": 0,
                  "dire_score": 0,
                  "players": [
                    {
                      "account_id": 25907144,
                      "hero_id": 0
                    },
                  ],
                  "building_state" : 19138340,
                }
              ]
             }
          ```
       * We only use several fields from the returned object. they are `server_steam_id`, `game_time`,`radiant_score`, `dire_score`, and
         `hero_id` in the array `players`. Note that, it will have 10 players in one game so that we must have 10 `hero_id`.
      
   * GET `/IDOTA2MatchStats_570/GetRealtimeStats/v1/`
      * Usage
        * `http://api.steampowered.com/IDOTA2MatchStats_570/GetRealtimeStats/v1/?server_steam_id=xxx&key=xxx`
       
     * Description
        * API from STEAM to get detailed game status hosted on the server
        * This API is the basis of DOTA2 VisLive. The backend use this API to get live game status.
        
     * Parameter
        * server_steam_id (17-bit server identification number)
        * key (32-bit STEAM auth key)
     
     * Return
        * It returns a long json object that describe the game status in detail. Here is part of that object.
          ```json
             {
              "match": {
                "server_steam_id": 90122822260959240,
                "matchid": 4351751659,
                "timestamp": 980,
                "game_time": 667,
                "game_mode": 3,
                "league_id": 0,
                "league_node_id": 0,
                "game_state": 5
              },
              "teams": [
                  {
                    "team_number": 2,
                    "team_id": 0,
                    "team_name": "",
                    "team_tag": "",
                    "team_logo": 0,
                    "score": 9,
                    "net_worth": 15477,
                    "players": [
                      {
                        "accountid": 210750366,
                        "playerid": 0,
                        "name": "<<Tira. Duolc",
                        "team": 2,
                        "heroid": 80,
                        "level": 8,
                        "kill_count": 3,
                        "death_count": 2,
                        "assists_count": 0,
                        "denies_count": 11,
                        "lh_count": 42,
                        "gold": 615,
                        "x": -0.359362810850143433,
                        "y": 0.303794801235198975,
                        "net_worth": 3725
                      },
                     ]
                  }
                 ],
                 "graph_data": {
                   "graph_gold": [
                      0,
                      -31,
                      -96,
                      -507,
                      -831,
                      -755,
                      -660,
                      -511,
                      -436,
                      -492,
                   ]
                  }
               }
          ```
         * We basically needs all fields to visualize the game correctly. The field `team` has two objects : `team_name = 2` and `team_name = 3`. We need both of them. In each `team` object, a field called `players` contains 5 players' status in the game. We need all of them. 
         
## DOTA2 VisLive
   * GET `/matchs`
     * Description
        * Ask backend to return 10 live DOTA2 matches.
        * It should call STEAM API GET `/IDOTA2Match_570/GetTopLiveGame/v1/` to get data and formanted the raw data.
        
     * Parameter
        * None
     
     * Return
        * It should return a status code and a `games` objects that contains __10__ game summaries. Here is a successful sample. The field `"players"` should have __10__ objects in total to represent 10 players. The fields `"hero_name"` and `"hero_image"` can be queried from `data/heroes.json` with `"hero_id"`. `"hero_name"` in `data/heroes.json` is `"localized_name"`. and `"hero_image"` is `"img"`. For other fields, we use exact same names in the STEAM API return value. 
          ```json
            {
              "status": 200,
              "games": 
                [
                  {
                    "server_steam_id": 90122822260959240,
                    "radiant_score": 9,
                    "dire_score": 7,
                    "game_time": 1183, 
                    "players": 
                      [
                        {
                          "hero_id": 98,
                          "hero_name":  "Timbersaw",
                          "hero_img" :"assets/heroes/onPage/timbersaw.png",
                        },
                      ]
                  }
                ]
            }
          ```
   * GET `/match/{server_steam_id}`
     * Description
        * Ask backend to return detailed info of a chosen match.
        * It should call STEAM API GET `/IDOTA2Match_570/GetRealtimeStats/v1/` to get live game status.
        
     * Parameter
        * server_steam_id (17-bit server identification number)
     * Return
        * It should return a status code and a JSON object that describe the game status in detail. Here is a successful sample. `"radiant"` refers to data in the object that has`"team_number = 2"`, and `"dire"` referst to data in the object that has `"team_number" = 3`. They are all in the field `"teams"` of the `/IDOTA2Match_570/GetRealtimeStats/v1/`'s return value. For the field `"buildings"`, `"team" : 2` is `radiant` buildings and `"team": 3` is `dire` buildings.  
          ```json
            {
              "game_time": 980,
              "radiant": {
                  "net_worth": 5000,
                  "score" : 12,
                  "players": [
                    {
                      "name": "你看见我头上的纸飞机了么wrrryyyy",
                      "heroid": 36,
                      "level": 14,
                      "kill_count": 5,
                      "death_count": 6,
                      "assists_count": 3,
                      "denies_count": 3,
                      "lh_count": 119,
                      "gold": 3102,
                      "x": 0.248417675495147705,
                      "y": 0.22314530611038208,
                      "net_worth": 9177
                    },],
                   "buildings":[
                    {
                      "heading": 1.80970895290374756,
                      "type": 0,
                      "lane": 1,
                      "tier": 1,
                      "x": -0.377413123846054077,
                      "y": 0.109556078910827637,
                      "destroyed": false
                     },  
                   ]
               },
              "dire" : "same as radiant", 
            }
         
          ```
        * If STEAM API returns a empty json, it means that `server_steam_id` is incorrect. It should returns an error code and an error message. Here is the sample.
          ```json
            { "status": 404,
              "message": "Match Not Found."
            }
          ```
          
       
  
