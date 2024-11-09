import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './products.service';
import { CartService } from '@core/cart.service';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Observable<Product[]> | null = null;

  constructor(
    private productsService: ProductService,
    private router: Router,
    private cartService: CartService,
    private firebaseAuthService: FirebaseAuthService
  ) {}

  ngOnInit(): void {
    this.products = this.productsService.getProducts();

    // this.firebaseAuthService.currentUser$.subscribe(user => {
    //   if (user) {
    //     this.products = this.productsService.getProducts();
    //   } else {
    //     this.products = this.productsService.getProducts();
    //   }
    // });
  }

  addToCart(product: Product): void {
    // Verifique se o usuário está autenticado antes de adicionar ao carrinho
    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user) {
        this.cartService.add(product);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
