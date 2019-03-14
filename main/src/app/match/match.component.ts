import { Component, OnInit } from '@angular/core';
import { GetMatchesService } from '../get-matches.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent implements OnInit {
  matchList: any = [];
  loadingData = true;
  public data$ = BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private matches: GetMatchesService, private router: Router) {
  }

  ngOnInit() {
    this.matches.getLiveMatches().subscribe(matches => {
      this.matchList = matches;
      this.loadingData = false;
    });
  }

  watchMatch(matchId: string) {
    this.router.navigate(['matchDetail']);
  }
}
