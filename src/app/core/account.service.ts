import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from './../../environments/environment';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net';


  constructor(private http: HttpClient, private auth: FirebaseAuthService) {}

  createAccount(accountData: any): Observable<any> {
    const x_client_id = environment.pagbank.client_id;
    const client_secret = environment.pagbank.client_secret;
    const authorization = `Bearer ${environment.pagbank.bearer_token}` ;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x_client_id': x_client_id, 'x_client_secret': client_secret, 'authorization': authorization});
    return this.http.post(`${this.apiUrl}/createAccount/save-account`, accountData, { headers });
  }

  createOrder(orderData: any): Observable<any> {
    const authorization = `Bearer ${environment.pagbank.bearer_token}`;
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authorization,
      'x-idempotency-key': idempotencyKey // Substitua por um idempotency-key único se necessário
    });

    return this.http.post(`${this.apiUrl}/createAccount/create-order`, orderData, { headers });
  }

  saveAccount(accountData: any): Observable<any> {
    console.log('salve account');
    console.log(accountData);
    return this.http.post(`${this.apiUrl}/createAccount/save-account`, accountData);
  }
  saveOrder(orderData: any): Observable<any> {
    console.log('salve account');
    console.log(orderData);
    return this.http.post(`${this.apiUrl}/createAccount/save-order`, orderData);
  }
  getAccountByEmail(email: string): Observable<any> {
    return this.auth.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable(observer => observer.error('Usuário não autenticado'));
        }
        return new Observable(observer => {
          user.getIdToken().then((idToken) => {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

            // Requisição HTTP com cabeçalho de autorização
            this.http.get(`${this.apiUrl}/createAccount/get-account-by-email`, {
              headers,
              params: { email }
            }).subscribe(
              data => {
                observer.next(data);
                observer.complete();
              },
              error => observer.error(error)
            );
          }).catch(error => observer.error(error));
        });
      })
    );
  }

  getOrderByEmail(email: string): Observable<any> {
    return this.auth.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable(observer => observer.error('Usuário não autenticado'));
        }
        return new Observable(observer => {
          user.getIdToken().then((idToken) => {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

            // Requisição HTTP com cabeçalho de autorização
            this.http.get(`${this.apiUrl}/createAccount/get-orders-by-email`, {
              headers,
              params: { email }
            }).subscribe(
              data => {
                observer.next(data);
                observer.complete();
              },
              error => observer.error(error)
            );
          }).catch(error => observer.error(error));
        });
      })
    );
  }
  getUserIp(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json');
  }

}
