import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from './../../environments/environment';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app';


  constructor(private http: HttpClient, private auth: FirebaseAuthService) {}

  createAccount(accountData: any): Observable<any> {
    const x_client_id = environment.pagbank.client_id;
    const client_secret = environment.pagbank.client_secret;
    const authorization = `Bearer ${environment.pagbank.bearer_token}` ;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-client-id': x_client_id,
      'x-client-secret': client_secret,
      'Authorization': authorization});

      console.log("Request Headers:", headers);
      console.log("Request Body:", accountData);

    return this.http.post(`${this.baseUrl}/accounts`, accountData, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao criar createAccount:', error);
        return throwError(error);
      }));
  }

  createOrder(orderData: any): Observable<any> {
    const authorization = `Bearer ${environment.pagbank.bearer_token}`;
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authorization,
      'x-idempotency-key': idempotencyKey // Substitua por um idempotency-key único se necessário
    });

    return this.http.post(`${this.baseUrl}/accounts`, orderData, { headers });
  }


  saveAccount(accountData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/accounts-api`, accountData, { headers: headers}).pipe(
      catchError(error => {
        console.error('Erro ao criar a conta do usuário:', error);
        return throwError(error);
      })
    );
  }



  updateAccount(accountId: string, updateData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/accounts-api/${accountId}`, updateData, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar os dados da conta:', error);
        return throwError(error);
      })
    );
  }


  saveOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createAccount/save-order`, orderData);
  }

  // getAccountByEmail(email: string): Observable<any> {
  //   return this.auth.currentUser$.pipe(
  //     switchMap(user => {
  //       if (!user) {
  //         return new Observable(observer => observer.error('Usuário não autenticado'));
  //       }
  //       return new Observable(observer => {
  //         user.getIdToken().then((idToken) => {
  //           const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

  //           // Requisição HTTP com cabeçalho de autorização
  //           this.http.get(`${this.baseUrl}/createAccount/get-account-by-email`, {
  //             headers,
  //             params: { email }
  //           }).subscribe(
  //             data => {
  //               observer.next(data);
  //               observer.complete();
  //             },
  //             error => observer.error(error)
  //           );
  //         }).catch(error => observer.error(error));
  //       });
  //     })
  //   );
  // }

  // getOrderByEmail(email: string): Observable<any> {
  //   return this.auth.currentUser$.pipe(
  //     switchMap(user => {
  //       if (!user) {
  //         return new Observable(observer => observer.error('Usuário não autenticado'));
  //       }
  //       return new Observable(observer => {
  //         user.getIdToken().then((idToken) => {
  //           const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

  //           // Requisição HTTP com cabeçalho de autorização
  //           this.http.get(`${this.baseUrl}/createAccount/get-orders-by-email`, {
  //             headers,
  //             params: { email }
  //           }).subscribe(
  //             data => {
  //               observer.next(data);
  //               observer.complete();
  //             },
  //             error => observer.error(error)
  //           );
  //         }).catch(error => observer.error(error));
  //       });
  //     })
  //   );
  // }
  getUserIp(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json');
  }

}
