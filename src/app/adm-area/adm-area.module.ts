import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmAreaRoutingModule } from './adm-area-routing.module';
import { HomeComponent } from './home/home.component';
import { AdmAreaComponent } from './adm-area.component';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AdmAreaComponent, HomeComponent, OrderComponent, CategoryComponent, ProductComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    AdmAreaRoutingModule
  ]
})
export class AdmAreaModule { }
