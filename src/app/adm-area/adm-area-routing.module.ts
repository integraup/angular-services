import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmAreaComponent } from './adm-area.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: '',
    component: AdmAreaComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'order', component: OrderComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'new-product', component: ProductComponent }

      // Adicione outras rotas filhas conforme necessário
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmAreaRoutingModule { }
