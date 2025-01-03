import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, switchMap, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly apiUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app';
  userData: any;

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      // Obtém o usuário atual
      const user = await firstValueFrom(this.authService.currentUser$);

      if (!user || !user.email) {
        // Redireciona para login se não estiver autenticado
        this.router.navigate(['/login']);
        return false;
      }

      // Busca os dados do usuário em "accounts" via API
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const params = new HttpParams().set('email', user.email);

      const account = await firstValueFrom(
        this.httpClient.get<any>(`${this.apiUrl}/accounts-api`, { params, headers }).pipe(
          catchError((error) => {
            console.error('Erro ao verificar permissões:', error);
            this.router.navigate(['/login']);
            return of(null); // Retorna `null` em caso de erro na API
          })
        )
      );

      if (!account) {
        return false; // Bloqueia o acesso em caso de erro ou ausência de dados
      }

      // Prepara e armazena os dados do usuário
      this.userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        accountData: account,
      };
      this.authService.setUserData(this.userData);

      // Permite o acesso
      return true;
    } catch (error) {
      console.error('Erro no AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
