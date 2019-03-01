import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  request: any;
  server_steam_id: any;
  heroes: any;
  bans: any;
  constructor(private matchDetail: ActivatedRoute, private matchList: Router) { }

  ngOnInit() {
    this.request = this.matchDetail.params.subscribe(params => {
      this.server_steam_id = params;
      this.heroes = ['../../assets/heroes/onPage/abaddon.png', 
                     '../../assets/heroes/onPage/alchemist.png',
                     '../../assets/heroes/onPage/axe.png', 
                     '../../assets/heroes/onPage/chen.png', 
                     '../../assets/heroes/onPage/clinkz.png',  
                    ];
      this.bans = '../../assets/heroes/onPage/default.png'
      console.log(this.server_steam_id);
    });
  }
}
