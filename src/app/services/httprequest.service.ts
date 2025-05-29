import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Consent } from '../model/consent';


@Injectable({
  providedIn: 'root'
})
export class HttprequestService {

  private url = environment.apiUrl;


  constructor(private http: HttpClient) { }

  post(uri: string, body: any): Observable<any> {
    return this.http.post(this.url + uri, body)
      .pipe(
        catchError(error => {
          throw Error(error);
        })
      );
  }

  get(uri: string): Observable<any> {
    return this.http.get(this.url + uri)
      .pipe(
        catchError(error => {
          throw Error(error);
        })
      );
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
    return this.post('/consents', consent);
  }
}
