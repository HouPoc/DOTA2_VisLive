import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort, MatTableDataSource} from '@angular/material';
import { GetMatchDetailService } from '../get-match-detail.service';

export interface Player {
  name: string;
  icon: string;
  level: number;
  kill: number;
  death: number;
  assist: number;
  deny: number;
  last_hit: number;
  gold: number;
  net_worth: number;
}



@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})


export class MatchDetailComponent implements OnInit {

  matchDetail: any;
  interval: any;
  request: any;
  server_steam_id: any;
  // The following is about radiant
  radiant_score: number;
  radiant_heroes: any;
  radiant_bans: any;
  radiant_towers: any;
  radiant_barracks: any;
  radiant_base: any;
  // The following is about dire
  dire_score: number;
  dire_heroes: any;
  dire_bans: any;
  dire_towers: any;
  dire_barracks: any;
  dire_base: any;

  // The following is about match MATA DATA
  time: number;
  graph_data: any[];
  Players: Player[] = [];


  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Team Worth Difference'},
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';


  constructor(private match: ActivatedRoute,
              private getMatchDetail: GetMatchDetailService
              ) { }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.Players);
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    // Get Server Steam ID from previous page.
    this.request = this.match.params.subscribe(params => {
      this.server_steam_id = params.server_steam_id;
      this.dataSource.sort = this.sort;
     
    });

    // Call service to get match data with server steam id as query key
    this.interval = setInterval(() => {
      this.getMatchDetail.getMatchDetail(this.server_steam_id).subscribe(match_detail => {
        this.matchDetail = match_detail;
        console.log(this.matchDetail);
        this.extractData();
        console.log()
        //console.log()
      });
    }, 5000);

  }

  extractData() {
    // collect match mata data
    //console.log(2323);
    this.Players = [];
    this.time = this.matchDetail.time;
    this.graph_data = this.matchDetail.worth_graph;
    let i = 0;
    for (const p of this.matchDetail.radiant.players) {
      const tmp = {
        'name': p.name,
        'level': p.level,
        'kill': p.kill_count,
        'death': p.death_count,
        'assist': p.assists_count,
        'deny': p.denies_count,
        'gold': p.gold,
        'net_worth': p.net_worth,
        'last_hit': p.lh_count,
        'icon': this.matchDetail.picks.radiant[i].icon
      };
      this.Players.push(tmp);
      i = i + 1;
    }
    
    let j = 0;
    for (const p of this.matchDetail.dire.players) {
      const tmp = {
        'name': p.name,
        'level': p.level,
        'kill': p.kill_count,
        'death': p.death_count,
        'assist': p.assists_count,
        'deny': p.denies_count,
        'gold': p.gold,
        'net_worth': p.net_worth,
        'last_hit': p.lh_count,
        'icon': this.matchDetail.picks.dire[j].icon
      };
      this.Players.push(tmp);
      j = j + 1;
    }
    console.log(this.Players);
    // Net worth line
    this.lineChartData = [{data: this.graph_data, label: 'Team Worth Difference'}];
    this.lineChartLabels = this.range(0, this.time, this.graph_data.length);

    // collect radiant_data
    this.radiant_score = this.matchDetail.radiant.score;
    this.radiant_heroes = this.matchDetail.picks.radiant;
    this.radiant_bans = this.matchDetail.bans.radiant;
    this.radiant_towers = this.matchDetail.radiant.buildings[0];
    this.radiant_barracks = this.matchDetail.radiant.buildings[1];
    this.radiant_base = this.matchDetail.radiant.buildings[2][0];

    // collect dire_data
    this.dire_score = this.matchDetail.dire.score;
    this.dire_heroes = this.matchDetail.picks.dire;
    this.dire_bans = this.matchDetail.bans.dire;
    this.dire_towers = this.matchDetail.radiant.buildings[0];
    this.dire_barracks = this.matchDetail.radiant.buildings[1];
    this.dire_base = this.matchDetail.radiant.buildings[2][0];
  }

  range(_p: number, _t?: number, _s?: number): Array<number> {
    /**
     * @param <_p> Return a list integers of zero until <_p> value.
     * @param <_t> Return a list integers of <_t> until <_p> value.
     * @param <_s> Return a list integers of <_t> until <_p> with steps <_s> value.
     * @return Return a array list
     */

    let start: number = (_t) ? _p : 0;
    let stop: number = (_t) ? _t : _p;
    let step: number = (_s) ? _s : 1;

    let t: Array<number> = [];
    for (let i = start; i < stop; i = i + step) {
      t.push(i);
    }

    return t;
  }
}

