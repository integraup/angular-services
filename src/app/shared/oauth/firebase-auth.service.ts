import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService, NotificationType } from '@core/notification.service';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider, OAuthProvider, OAuthCredential, UserCredential,  createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';

import type {
  Auth,
  User as FirebaseUser,
  User
} from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { sendPasswordResetEmail } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: "root"})
export class FirebaseAuthService {
  auth: Auth;
  firebaseUs: FirebaseUser;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  getFirebase() {
    return getAuth();
  }




  constructor(private afApp: FirebaseApp, private notificationService: NotificationService) {
    this.auth = getAuth(this.afApp);
    this.checkAuthState();
  }

  private checkAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user ? user : null);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUserSubject.next(userCredential.user);
      this.notificationService.notify(NotificationType.Success, 'Login realizado com sucesso!'); // Notificação de sucesso
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.notificationService.notify(NotificationType.Error, 'Erro ao fazer login. Verifique suas credenciais.'); // Notificação de erro
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

  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.notificationService.notify(NotificationType.Info, 'Usuário criado com sucesso.'); // Notificação de sucesso
      return userCredential; // O userCredential contém o usuário criado
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
