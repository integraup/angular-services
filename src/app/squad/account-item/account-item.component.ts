import { Component, OnInit } from '@angular/core';
import { AccountData } from '@core/account-data.model';
import { AccountService } from '@core/account.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'bot-account-item',
  templateUrl: './account-item.component.html',
  styleUrl: './account-item.component.css'
})
export class AccountItemComponent implements OnInit {

  constructor(private accountService: AccountService, private firebaseAuthService: FirebaseAuthService, private notificationService: NotificationService){}
  accountData?: AccountData;
  ngOnInit(): void {
    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user && user.email) {
        const email = user.email;
        this.accountService.getAccountByEmail(email).subscribe(
          (data) => {
            console.log('Conta recuperada:', data);
            this.accountData = data;
          },
          (error) => {
            this.notificationService.notify(NotificationType.Error, 'Erro ao recuperar dados. Verifique suas credenciais com o administrador.');
          }
        );
      }
    });
  }
}
