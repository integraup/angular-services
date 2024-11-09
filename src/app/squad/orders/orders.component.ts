import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@core/account.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Component({
  selector: 'bot-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './orders.component.css',
  providers: [AccountService]
})
export class OrdersComponent  implements OnInit {
  orderData: any[] = [];
  showDetails: { [key: string]: boolean } = {};

  constructor(private accountService: AccountService,  private router: Router, private firebaseAuthService: FirebaseAuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {

    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user && user.email) {
        const email = user.email;
        this.accountService.getOrderByEmail(email).subscribe(
          (data) => {
            console.log('teste');
            this.orderData = data;
          },
          (error) => {
            if (error.status === 404) {
              this.notificationService.notify(NotificationType.Error, 'Nenhum pedido encontrado para este e-mail.');
            }
            // else {
            //   this.notificationService.notify(NotificationType.Error, 'Erro ao recuperar dados. Verifique suas credenciais com o administrador.');
            // }
          }
        );
      }
    });

  }

  fetchOrderByEmail(email: string): void {
    this.accountService.getAccountByEmail(email).subscribe(
      () => {
        this.accountService.getOrderByEmail(email).subscribe(
          (data) => {
            this.orderData = data.map((order: any) => ({ ...order, showDetails: false }));
          },
          (error) => {
            this.notificationService.notify(NotificationType.Error, 'Erro ao buscar a ordem.');
          }
        );
      },
      (error) => {
        this.notificationService.notify(NotificationType.Error, 'Usuário não autenticado.');
      }
    );
  }

  toggleDetails(orderId: string): void {
    this.showDetails[orderId] = !this.showDetails[orderId]; // Controla detalhes por ID
  }

}
