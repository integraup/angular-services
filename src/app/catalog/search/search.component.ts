import { Component } from '@angular/core';
import { ProductService } from '@catalog/products.service';
import { CartService } from '@core/cart.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Product } from '@shared/product.model';

@Component({
  selector: 'bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  products: Product[] = []; // Atualizado para combinar dados
  searchTerm: string = '';
  emailSalles: string;

  constructor(
    private productsService: ProductService,
    private firebaseAuthService: FirebaseAuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.firebaseAuthService.currentUser$.subscribe((user) => {
      if (user?.email) {
        this.emailSalles = user.email; // Captura o email do usuário logado
        this.productsService
          .getProducts(this.emailSalles)
          .subscribe((products) => (this.products = products));
      }
    });
  }

  // Adiciona ao carrinho no formato combinado
  addToCart(product: any) {
    //this.cartService.add(item);
  }

  // Filtra os produtos baseados no termo de busca
  filter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  }

  // Retorna os produtos filtrados
  getFilteredProducts() {
    return this.searchTerm === ''
      ? this.products
      : this.products.filter((item) =>
          item.name.toLowerCase().includes(this.searchTerm)
        );
  }
}
