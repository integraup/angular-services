import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './products.service';
import { CartService } from '@core/cart.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Category, CategoryService } from './category.service';

@Component({
  selector: 'bot-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  emailSalles: string = '';
  productImages: { [id: string]: { urls: string[]; currentIndex: number } } = {};
  selectedCategory: string; // Para filtrar produtos por categoria

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private firebaseAuthService: FirebaseAuthService
  ) {}

  ngOnInit(): void {



    this.firebaseAuthService.currentUser$.subscribe((user) => {
      this.selectedCategory = "all";
      if (user?.email) {
        console.log("user");
        console.log(user);

        this.emailSalles = user.email;
        this.loadProducts("");
        this.loadCategories("");

      }else {
        this.loadProducts("");
        this.loadCategories("");
      }
    });

    this.productImages = {};
  }

  loadProducts(emailSalles: string): void {
    this.productService.getProducts(emailSalles).subscribe((products) => {
      this.products = products;
      this.products.forEach((product) => {
        // Inicializa productImages com um estado válido.
        this.productImages[product.id] = { urls: [], currentIndex: 0 };

        product.imageUrls.slice(0, 5).forEach((imagePath) => {
          this.productService
            .downloadFileFromStorage(product.id, imagePath)
            .then((url) => {
              if (this.productImages[product.id]) {
                this.productImages[product.id].urls.push(url);
              }
            });
        });
      });
    });
  }

  hasProductImages(productId: string): boolean {
    return (
      !!this.productImages[productId]?.urls?.length &&
      this.productImages[productId]?.currentIndex !== undefined
    );
  }

  getProductImage(productId: string): string {
    const product = this.productImages[productId];
    if (product?.urls?.length) {
      return product.urls[product.currentIndex || 0];
    }
    return 'assets/placeholder.png'; // Caminho para uma imagem padrão
  }


  loadCategories(emailSalles: string): void {
    this.categoryService.getCategories(emailSalles).subscribe(
      (categories) => (this.categories = categories),
      (error) => console.error('Erro ao carregar categorias:', error)
    );
  }

  filterProducts(): Product[] {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(
      (product) => product.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  changeImage(productId: string, direction: 'next' | 'previous'): void {
    const productImages = this.productImages[productId];
    if (productImages) {
      productImages.currentIndex =
        (productImages.currentIndex +
          (direction === 'next' ? 1 : -1) +
          productImages.urls.length) %
        productImages.urls.length;
    }
  }

  addToCart(product: Product): void {
    const productWithImages = {
      ...product,
      imageUrls: this.productImages[product.id]?.urls || [], // Inclui as URLs carregadas
    };
    this.cartService.add(productWithImages);
  }

}
