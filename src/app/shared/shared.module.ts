import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { ReceiveComponent } from './receive/receive.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [ProductDetailsComponent, CartComponent, CheckoutComponent],
  exports: [ProductDetailsComponent, CartComponent, CommonModule]
})
export class SharedModule { }
