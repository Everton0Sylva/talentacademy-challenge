import { Injectable } from '@angular/core';
import { catchError, debounceTime, delay, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Consent } from '../model/consent';


@Injectable({
  providedIn: 'root'
})
export class HttprequestService {

  private url = environment.apiUrl;


  constructor(private http: HttpClient) { }

  post(uri: string, body: any): Observable<any> {
    return this.http.post(this.url + uri, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message || "Server error"))
      }))
  }

  get(uri: string): Observable<any> {
    return this.http.get(this.url + uri);
  }

  getConsents(): Observable<[Consent]> {
    return this.get('/consents')
      .pipe(
        map((resp: any) => {
          return resp.map((data: any) => {
            return new Consent(data);
          });
        })
      )
  }
  postConsent(consent: Consent): Observable<any> {
    return this.post('/consents', consent)
  }
}
