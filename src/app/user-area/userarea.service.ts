import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserareaService {
  private readonly apiUrl = environment.apiUrl;
  private auth = getAuth(this.firebaseApp);

  credentials: any;
  constructor(private httpClient: HttpClient, private firebaseApp: FirebaseApp) {
    // this.getCredentials().subscribe({
    //   next: (data) => (this.credentials = data),
    //   error: (err) => console.error('Erro ao obter credenciais:', err),
    // });
  }

  // getCredentials(): Observable<any> {
  //   return this.httpClient.get<any>(this.apiUrl);
  // }

  getOrders(email: string): Observable<any> {
     const headers = new HttpHeaders({
              'Content-Type': 'application/json'
            });
            const params = new HttpParams().set('email', email);

    return this.httpClient.get<any>(`${this.apiUrl}/orders`, { params, headers });
  }


}
