import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetMatchesService {

  constructor(private http: Http) { }
  getLiveMatches() {
    return this.http.get('/liveMatches').pipe(map(res => res.json()));
  }
}
