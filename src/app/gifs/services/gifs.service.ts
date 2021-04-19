import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGIFResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey = 'NnqVVSSl2L5flfK2NBiIrJwEF5ttPQIw';
  private url = 'https://api.giphy.com/v1/gifs';
  private _history: string[] = [];

  public results: Gif[] = [];
  get history() {
    return [...this._history];
  }

  constructor(private _http: HttpClient) {
    this._history = JSON.parse(localStorage.getItem('history')) || [];
    this.results = JSON.parse(localStorage.getItem('results')) || [];
  }
  searchGifs(query: string = '') {
    query = query.trim().toLowerCase();
    if (!this._history.includes(query)) {
      this._history.unshift(query);
      this._history = this._history.splice(0, 10);

      localStorage.setItem('history', JSON.stringify(this._history));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', '10')
      .set('lang', 'es');

    this._http.get<SearchGIFResponse>(`${this.url}/search`, { params }).subscribe(resp => {
      this.results = resp.data;
      localStorage.setItem('results', JSON.stringify(this.results));
    });
  }

}
