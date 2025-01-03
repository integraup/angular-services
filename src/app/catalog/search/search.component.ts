import { Component } from '@angular/core';
import { Product } from '../product.model';
import { productsArray } from '../products-data'
import { ProductService } from '@catalog/products.service';
import { CartService } from '@core/cart.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Component({
  selector: 'bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  products: Product[] = [...productsArray];
  searchTerm: string = '';
  cart: Product[] = [];
  emailSalles: string;

  constructor(private productsService: ProductService, private firebaseAuthService: FirebaseAuthService, private cardService: CartService) { }

  ngOnInit(): void {
    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user?.email) {
        this.emailSalles = user.email; // Captura o email do usuário logado
        this.productsService.getProducts(this.emailSalles).subscribe((products) => this.products = products);

        setTimeout(() => this.productsService.getProducts(this.emailSalles), 200);
      }
    });


  }

  addToCart(product: Product) {
    this.cardService.add(product);
  }

  filter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  }

  getFilteredProducts() {
    return this.searchTerm === ''
      ? this.products
      : this.products.filter(
        (product: Product) => product.name.toLowerCase().includes(this.searchTerm)
      );
  }
}
