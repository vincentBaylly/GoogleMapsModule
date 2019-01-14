import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Listings } from '../../model/map.classes';
import { MessageService } from '../../shared/message.service';

const API_KEY = 'AIzaSyCSJ4lLjYEbl1a1F-ynTrdY3BwIkvHAklc';
const url = 'https://maps.googleapis.com/maps/api/js?key='+ API_KEY +'&callback=initMap';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  private loadMap: Promise<any>;

  private listingsUrl = 'http://localhost:3000/featured-homes';  // URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.loadMap = new Promise((resolve) => {
      window['initMap'] = () => {
        resolve();
      };
      this.loadScript()
    });
  }

  public initMap():Promise<any> {
    return this.loadMap;
  }

  private loadScript() {
    let script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';


    if (document.body.contains(script)) {
      return;
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  findFeaturedHomes(): Observable<Listings> {
    return this.http.get<Listings>(`${this.listingsUrl}/?regions%5B%5D=4&subtype%5B%5D=4&is_for_sale=1&with_builders=1&parent=1&sort=-published_at&page%5Bnumber%5D=1&province=qc&page%5Bsize%5D=11&include=builders`, httpOptions).pipe(
      tap(_ => this.log(`found houses matching regions%5B%5D=4&subtype%5B%5D=4&is_for_sale=1&with_builders=1&parent=1&sort=-published_at&page%5Bnumber%5D=1&province=qc&page%5Bsize%5D=11&include=builders`)),
      catchError(this.handleError<Listings>('findFeaturedHomes'))
    );
  }

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`GoogleApiService: ${message}`);
  }

}
