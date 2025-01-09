import { Injectable, NgModule } from '@angular/core';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';
import { CartComponent } from '@shared/cart/cart.component';
import { CatalogComponent } from '@catalog/catalog.component';
import { SearchComponent } from '@catalog/search/search.component';
import { ReceiveComponent } from '@shared/receive/receive.component';
import { LoginComponent } from '@shared/oauth/login/login.component';
import { RecoverPasswordComponent } from '@shared/oauth/recover-password/recover-password.component';
import { CheckoutComponent } from '@shared/checkout/checkout.component';
import { AuthGuard } from '@shared/oauth/auth.guard';
import { AuthAdmGuard } from '@shared/oauth/authAdm.guard';

@Injectable({providedIn: 'root'})
export class AdminGuard {
  canActivate() {
    return true;
  }
}

const routes: Routes = [
  { path: 'catalog', component: CatalogComponent, title: "Catalog - MercadoPag - Loja Online", },
  { path: 'search', component: SearchComponent, title: "Search - MercadoPag - Loja Online" },
  { path: 'cart', component: CartComponent, title: "Cart - MercadoPag - Loja Online" },
  { path: 'checkout', component: CheckoutComponent, canActivate: mapToCanActivate([AuthGuard]), title: "checkout - MercadoPag - Loja Online" },
  { path: 'login', component: LoginComponent, title: "Acesso - MercadoPag - Loja Online" },


  { path: 'recover', component: RecoverPasswordComponent, title: "Rcover - MercadoPag - Loja Online" },

  { path: 'connect_salles', component: ReceiveComponent, title: "Autorização de uso da plataforma" },
  { path: 'squad', loadChildren: () => import('./squad/squad.module').then(m => m.SquadModule) },
  { path: 'user', loadChildren: () => import('./user-area/userarea.module').then(m => m.UserAreaModule), canActivate: mapToCanActivate([AuthGuard]), title: "checkout - MercadoPag - Loja Online"  },
  { path: 'adm', loadChildren: () => import('./adm-area/adm-area.module').then(m => m.AdmAreaModule), canActivate: mapToCanActivate([AuthAdmGuard]), },
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
