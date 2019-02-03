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
  constructor(private matchDetail: ActivatedRoute, private matchList: Router) { }

  ngOnInit() {
    this.request = this.matchDetail.params.subscribe(params => {
      this.server_steam_id = params;
      console.log(this.server_steam_id);
    });
  }

}
