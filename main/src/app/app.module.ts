import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import { TimeStamp2MinSecPipe } from './time-stamp2-min-sec.pipe';
import { GetMatchesService } from './get-matches.service';
import { HttpModule } from '@angular/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const ROUTES = [
  {
    path: '',
    redirectTo: 'matches',
    pathMatch: 'full'
  },
  {
    path: 'matches',
    component: MatchComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    TimeStamp2MinSecPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatExpansionModule,
    HttpModule ,
    MatProgressSpinnerModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [GetMatchesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
