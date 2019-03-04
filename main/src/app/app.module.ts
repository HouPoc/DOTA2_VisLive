import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import { TimeStamp2MinSecPipe } from './time-stamp2-min-sec.pipe';
import { GetMatchesService } from './get-matches.service';
import { HttpModule } from '@angular/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';
import {MatTableModule} from '@angular/material/table';

import {MatSortModule} from '@angular/material/sort';

const ROUTES = [
  {
    path: '',
    redirectTo: 'matches',
    pathMatch: 'full'
  },
  {
    path: 'matches',
    component: MatchComponent
  },
  {
    path: 'matchDetail',
    component: MatchDetailComponent,
  }

];

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    TimeStamp2MinSecPipe,
    MatchDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatExpansionModule,
    HttpModule ,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    ChartsModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [GetMatchesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
