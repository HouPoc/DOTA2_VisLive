import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetMatchDetailService {

  constructor(private http: Http) { }

  getMatchDetail(server_steam_id: string) {
    return this.http.get('/matchDetail/' + server_steam_id).pipe(map(res => res.json()));
  }
}
