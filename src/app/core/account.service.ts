import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from './../../environments/environment';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly apiUrl = environment.apiUrl;


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

    return this.http.post(`${this.apiUrl}/accounts`, accountData, { headers: headers }).pipe(
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

    return this.http.post(`${this.apiUrl}/orders`, orderData, { headers });
  }


  saveAccount(accountData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/accounts-api`, accountData, { headers: headers}).pipe(
      catchError(error => {
        console.error('Erro ao criar a conta do usuário:', error);
        return throwError(error);
      })
    );
  }

  Register(registerData: {userEmail: string, userName: string}): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/register`, registerData, { headers: headers}).pipe(
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
    return this.http.put(`${this.apiUrl}/accounts-api/${accountId}`, updateData, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar os dados da conta:', error);
        return throwError(error);
      })
    );
  }

  saveOrderData(orderData: any): Observable<any> {
    const authorization = `Bearer ${environment.pagbank.bearer_token}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/save-order`, orderData, { headers });
  }


  // saveOrder(orderData: any): Observable<any> {
  //   const authorization = `Bearer ${environment.pagbank.bearer_token}`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': authorization
  //   });
  //   return this.http.post(`${this.apiUrlLocal}/orders`, orderData, { headers });
  // }

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
