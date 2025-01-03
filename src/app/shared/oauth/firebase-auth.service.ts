import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, NotificationType } from '@core/notification.service';
import { BehaviorSubject, Observable, Subject, firstValueFrom, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, OAuthProvider, OAuthCredential, UserCredential,  createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';

import type {
  Auth,
  User as FirebaseUser,
  User
} from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: "root"})
export class FirebaseAuthService {
  auth: Auth;
  private userData: any;
  firebaseUs: FirebaseUser;
  private readonly apiUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app';
  private currentUserSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  private currentAccountSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();
  getFirebase() {
    return getAuth();
  }



  constructor(private afApp: FirebaseApp, private notificationService: NotificationService, private httpClient: HttpClient) {
    this.auth = getAuth(this.afApp);
    //this.checkAuthState();
  }

  // private checkAuthState() {
  //   onAuthStateChanged(this.auth, (user) => {
  //     this.currentUserSubject.next(user ? user : null);
  //   });
  // }


  setUserData(data: any): void {
    this.userData = data;
  }

  getUserData(): any {
    return this.userData;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      // Realiza o login com o Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Atualiza o estado atual do usuário


      // Configura os cabeçalhos e parâmetros da requisição HTTP
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const params = new HttpParams().set('email', email);

      // Faz a requisição para buscar os dados da conta
      return this.httpClient.get<any>(`${this.apiUrl}/accounts-api`, { params, headers }).pipe(
        switchMap((account: any) => {
          // Combina as informações da autenticação e da conta recuperada
          const userData = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            emailVerified: userCredential.user.emailVerified,
            accountData: account, // Dados da conta vindos da API
          };
          this.currentUserSubject.next(userData);
          // Notifica o sucesso
          this.notificationService.notify(NotificationType.Success, 'Login realizado com sucesso!');

          // Retorna o objeto com os dados combinados como Observable
          return of(userData);  // Usa 'of' para retornar o valor como Observable
        }),
        catchError((error) => {
          console.error('Erro ao fazer login:', error);
          this.notificationService.notify(NotificationType.Error, 'Erro ao fazer login. Verifique suas credenciais.');
          throw error;
        })
      ).toPromise(); // Retorna como Promise para o método assíncrono
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      // Notifica o erro
      this.notificationService.notify(NotificationType.Error, 'Erro ao fazer login. Verifique suas credenciais.');

      throw error;
    }
  }

  async fetchAccountDataAndLogin(email: string): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const params = new HttpParams().set('email', email);

    try {
      // Faz a requisição para buscar os dados da conta
      const account = await firstValueFrom(this.httpClient.get<any>(`${this.apiUrl}/accounts-api`, { params, headers }));

      this.currentAccountSubject.next(account);

      // Notifica o sucesso do login
      this.notificationService.notify(NotificationType.Success, 'Login realizado com sucesso!');

      // Retorna os dados do usuário
      return account;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.notificationService.notify(NotificationType.Error, 'Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    }
  }


  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.notificationService.notify(NotificationType.Info, 'Logout realizado com sucesso.'); // Notificação de sucesso
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      this.notificationService.notify(NotificationType.Error, 'Erro ao fazer logout.'); // Notificação de erro
      throw error;
    }
  }

  async signUp(email: string, password: string, roles: any): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.notificationService.notify(NotificationType.Info, 'Usuário criado com sucesso.'); // Notificação de sucesso
      return userCredential;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Email de redefinição de senha enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      throw error;
    }
  }



}


export interface UserData {
  uid: string;
  email: string | null; // Aceita valores nulos
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  accountData: any; // Substitua com um tipo mais específico se souber
}
