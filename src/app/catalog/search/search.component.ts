import { Component } from '@angular/core';
import { Product } from '../product.model';
import { productsArray } from '../products-data'
import { ProductService } from '@catalog/products.service';
import { CartService } from '@core/cart.service';

@Component({
  selector: 'bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  products: Product[] = [...productsArray];
  searchTerm: string = '';
  cart: Product[] = [];

  constructor(private productsService: ProductService, private cardService: CartService) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products) => this.products = products);

    setTimeout(() => this.productsService.getProducts(), 200);
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
