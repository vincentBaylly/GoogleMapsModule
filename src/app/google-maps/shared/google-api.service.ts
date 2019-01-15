import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from '../../shared/message.service';

const API_KEY = '[Insert API Key Here]';
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
