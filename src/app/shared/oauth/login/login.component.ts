import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Router } from '@angular/router';
import { NotificationService, NotificationType } from '@core/notification.service';

@Component({
  selector: 'bot-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firebaseAuthService: FirebaseAuthService, private notificationService: NotificationService,){
    this.loginForm = this.fb.group({
        email: ['', Validators.required],
        senha: ['', Validators.required],
      });
  }

  navigateToRecover() {
    this.router.navigate(['/recover']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const login = this.loginForm.get('email')?.value;
      const senha = this.loginForm.get('senha')?.value;

      this.firebaseAuthService.login(login, senha).then((response) => {
        if (response?.accountData?.rules?.isAdmin && !response?.accountData?.code) {
          this.notificationService.notify(NotificationType.Warning, 'Usuário é administrador precisa aceitar os termos, redirecionando...');

          const url = 'http://localhost:4200/connect_salles';
          const permissions = 'payments.read+payments.create+payments.refund+accounts.read+payments.split.read+checkout.create+checkout.view+checkout.update';
          const authorizationUrl = `https://connect.sandbox.pagseguro.uol.com.br/oauth2/authorize?response_type=code&client_id=723a6987-3bd4-4a75-9127-1fe9c800a4e8&redirect_uri=${url}&scope=${permissions}&state=${response.email}`;
          window.location.href = authorizationUrl;
        } else {
        }


      }).catch((error) => {
        console.error('Erro ao realizar login:', error);
        // Adicione lógica de tratamento de erro, se necessário
      });
    }
  }

}
