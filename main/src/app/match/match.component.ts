import { Component, OnInit } from '@angular/core';
import { GetMatchesService } from '../get-matches.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent implements OnInit {
  matchList: any = [];
  loadingData = true;
  constructor(private matches: GetMatchesService) {
  }

  ngOnInit() {
    this.matches.getLiveMatches().subscribe(matches => {
      this.matchList = matches;
      this.loadingData = false;
    });
  }

}
