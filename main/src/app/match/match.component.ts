import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetMatchesService } from '../get-matches.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent implements OnDestroy, OnInit {
  matchList: any = [];
  interval: any;
  loadingData = true;
  constructor(private matches: GetMatchesService, private router: Router) {
  }

  ngOnInit() {

    this.interval = setInterval(() => {
      this.matches.getLiveMatches().subscribe(matches => {
        this.matchList = matches;
        this.loadingData = false;
      });
      console.log(this.matchList);
    }, 5000);
  }

  ngOnDestroy () {
    clearInterval(this.interval);
  }

  watchMatch(matchId: string) {
    this.router.navigate(['matchDetail', matchId]);
  }
}
