import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@core/notification.service';
import { UserareaService } from '../userarea.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  user = {
    name: '',
    email: ''
  };
  orders: any[] = [];

  address = '';

   constructor(
    private router: Router,
    private userareaService: UserareaService,
                private notificationService: NotificationService,
                private firebaseAuthService: FirebaseAuthService) {}

  ngOnInit(): void {
  this.firebaseAuthService.currentUser$.subscribe((user) => {
    if (user?.email) {
      this.loadOrders(user.email);
      const userData = this.firebaseAuthService.getUserData();
      this.user = { name: userData.accountData.person.name, email: userData.accountData.email}
      this.address = `${userData.accountData.person.address.street}, ${userData.accountData.person.address.locality}, ${userData.accountData.person.address.city}, ${userData.accountData.person.address.region_code} - ${userData.accountData.person.address.postal_code}`;

    }
  });
}

loadOrders(email: string): void {
  this.userareaService.getOrders(email).subscribe((orders: any) => {
    console.log(orders);

    // Mapear as ordens para adicionar o campo showDetails e mensagem do status
    this.orders = orders.map((order: any) => {
      const status = order.charges[0]?.status || 'UNKNOWN';
      let statusMessage = '';
      let statusColor = '';

      // Definir mensagem baseada no status
      switch (status) {
        case 'AUTHORIZED':
        case 'PAID':
          statusMessage = 'Autorização bem-sucedida.';
          statusColor = '#28a745'; // Verde
          break;
        case 'DECLINED':
          statusMessage = 'Autorização negada.';
          statusColor = '#dc3545'; // Vermelho
          break;
        default:
          statusMessage = 'Status desconhecido.';
          statusColor = '#6c757d'; // Cinza
          break;
      }

      return {
        id: order.id,
        created_at: order.created_at,
        statusMessage, // Mensagem amigável para o status
        statusColor,
        customer: order.customer.name,
        email: order.customer.email,
        shippingAddress: `${order.shipping.address.street}, ${order.shipping.address.locality}, ${order.shipping.address.city} - ${order.shipping.address.region_code}, ${order.shipping.address.postal_code}`,
        items: order.items,
        showDetails: false, // Inicialmente, os detalhes estão ocultos
      };
    });

    console.log(this.orders);
  });
}

  navigateToRecover() {
    this.router.navigate(['/recover']);
  }


  editProfile() {
    console.log('Editar Perfil');
  }

  viewOrders() {
    console.log('Visualizar Pedidos');
  }

  editAddress() {
    console.log('Editar Endereço');
  }

  changePassword() {
    this.navigateToRecover();
  }

  logout() {
    console.log('Logout');
  }
}
