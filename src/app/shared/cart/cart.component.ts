import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { CartService } from '@core/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {


  constructor(private cardService: CartService, private router: Router) { }

  ngOnInit() { }

  get cartItems() {
    return this.cardService.cart();
  }

  get cartTotal() {
    return this.cardService.cartTotal();
  }

  removeFromCart(product: Product) {
    this.cardService.remove(product);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout'], { state: { cart: this.cartItems, total: this.cartTotal } });
  }

  getImageUrl(product: Product) {
    if (!product) return '';
    return '/assets/images/robot-parts/' + product.imageName;
  }
}
