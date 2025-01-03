import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@core/account.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Component({
  selector: 'bot-receive',
  standalone: true,
  imports: [],
  templateUrl: './receive.component.html',
  styleUrl: './receive.component.css'
})
export class ReceiveComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private firebaseAuthService: FirebaseAuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    if (code && state) {
      this.updateAccountWithCode(code, state);
    } else {
      this.notificationService.notify(NotificationType.Error, 'Erro: Parâmetros inválidos na URL.');
    }
  }

  async updateAccountWithCode(code: string, state: string): Promise<void> {
    try {


      const account = await this.firebaseAuthService.fetchAccountDataAndLogin(state);
      if (!account.firestoreId) {
        this.notificationService.notify(NotificationType.Error, 'Erro: Conta não encontrada no Firestore.');
        return;
      }

      account.code = code;

      console.log("account");
      console.log(account);

      this.accountService.updateAccount(account.firestoreId, account).subscribe({
        next: () => {
          this.notificationService.notify(NotificationType.Success, 'Dados atualizados com sucesso.');
          this.router.navigate(['/']); // Redireciona para a página desejada
        },
        error: (error) => {
          this.notificationService.notify(NotificationType.Error, 'Erro ao atualizar os dados da conta.');
          console.error('Erro ao atualizar conta:', error);
        }
      });
    } catch (error: any) {
      console.error('Erro ao recuperar o usuário autenticado ou atualizar conta:', error);
      this.notificationService.notify(NotificationType.Error, 'Erro inesperado ao atualizar os dados da conta.');
    }
  }
}
