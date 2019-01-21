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
   
