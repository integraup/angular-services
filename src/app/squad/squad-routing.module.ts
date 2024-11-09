import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SquadCatalogComponent } from './squad-catalog/squad-catalog.component';
import { CartComponent } from '@shared/cart/cart.component';
import { SharedModule } from '@shared/shared.module';
import { ReceiveComponent } from '@shared/receive/receive.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountItemComponent } from './account-item/account-item.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: 'account-squad', component: AccountFormComponent, title: "Account Services - PAGPAG - Loja Online" },
  { path: 'bot-squad', component: SquadCatalogComponent, title: "Bot Squad - PAGPAG - Loja Online" },
  { path: 'squad-cart', component: CartComponent, title: "Squad Cart - PAGPAG - Loja Online" },
  { path: 'bot-receivecd', component: ReceiveComponent, title: "Autorização de uso da plataforma - PAGPAG - Loja Online" },
  { path: 'bot-order', component: OrdersComponent, title: "Order de compra" },
  { path: 'bot-itemAccount', component: AccountItemComponent, title: "Autorização de uso da plataforma - PAGPAG - Loja Online" },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class SquadRoutingModule { }
