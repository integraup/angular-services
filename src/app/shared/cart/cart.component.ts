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
    var item = this.cardService.cart();
    return item;
  }

  get cartTotal() {
    return this.cardService.cartTotal();
  }

  removeFromCart(combinedItem: { product: Product; account: any }) {
    this.cardService.remove(combinedItem);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout'], { state: { cart: this.cartItems, total: this.cartTotal } });
  }

  getImageUrl(combinedItem: { product: Product; account: any; imageUrls: string[] }): string {
    if (combinedItem.product.imageUrls && combinedItem.product.imageUrls.length > 0) {
      return combinedItem.product.imageUrls[0]; // Usa a primeira imagem do produto
    }
    return '/assets/placeholder.png'; // Caminho para imagem padrão
  }
}
