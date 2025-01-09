import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent, title: "Account Services - MercadoPag - Loja Online" }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class UserAreaRoutingModule { }
