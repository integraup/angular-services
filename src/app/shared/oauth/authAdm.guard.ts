import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, switchMap, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthAdmGuard implements CanActivate {
  private readonly apiUrl = environment.apiUrl;
  userData: any;
  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private httpClient: HttpClient // Adicionando HttpClient
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
      const params = new HttpParams().set('email', user.email); // Usando o email para buscar a conta

      return this.httpClient.get<any>(`${this.apiUrl}/accounts-api`, { params, headers }).pipe(
        switchMap((account: string[]) => {
          // Combinando dados da autenticação e os dados da conta
           this.userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            accountData: account, // Dados da conta recuperados via API
          };
          this.authService.setUserData(this.userData);
          return of(this.userData.accountData.rules.isAdmin);
        }),
        catchError((error) => {
          console.error('Erro ao verificar permissões:', error);
          this.router.navigate(['/login']);
          return of(false); // Caso ocorra erro, redireciona para login
        })
      ).toPromise(); // Retorna uma Promise para o método canActivate
    } catch (error) {
      console.error('Erro no AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
