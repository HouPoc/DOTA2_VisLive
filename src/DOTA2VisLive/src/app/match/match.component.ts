import { Component, OnInit } from '@angular/core';
import { GetMatchesService } from '../get-matches.service';


@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent implements OnInit {
  match: any;
  constructor(private matches: GetMatchesService) {
  }

  ngOnInit() {
    this.matches.getLiveMatches().subscribe(match => {
      console.log(match);
      this.match = match;
      console.log(this.match);
    });
  }

}
