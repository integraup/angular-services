import { Injectable, NgModule } from '@angular/core';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';
import { CartComponent } from '@shared/cart/cart.component';
import { CatalogComponent } from '@catalog/catalog.component';
import { SearchComponent } from '@catalog/search/search.component';
import { ReceiveComponent } from '@shared/receive/receive.component';
import { LoginComponent } from '@shared/oauth/login/login.component';
import { RecoverPasswordComponent } from '@shared/oauth/recover-password/recover-password.component';
import { CheckoutComponent } from '@shared/checkout/checkout.component';

@Injectable({providedIn: 'root'})
export class AdminGuard {
  canActivate() {
    console.log('teste active can');
    return true;
  }
}

const routes: Routes = [
  { path: 'catalog', component: CatalogComponent, title: "Catalog - PAGPAG - Loja Online", canActivate: mapToCanActivate([AdminGuard]), },
  { path: 'search', component: SearchComponent, title: "Search - PAGPAG - Loja Online" },
  { path: 'cart', component: CartComponent, title: "Cart - PAGPAG - Loja Online" },
  { path: 'checkout', component: CheckoutComponent, title: "checkout - PAGPAG - Loja Online" },
  { path: 'login', component: LoginComponent, title: "Acesso - PAGPAG - Loja Online" },

  { path: 'recover', component: RecoverPasswordComponent, title: "Rcover - PAGPAG - Loja Online" },

  { path: 'connect_salles', component: ReceiveComponent, title: "Autorização de uso da plataforma" },
  { path: 'squad', loadChildren: () => import('./squad/squad.module').then(m => m.SquadModule) },
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
