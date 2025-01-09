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
  combinedData: Array<{ product: any; account: any }> = [];
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


        this.firebaseAuthService.fetchAccountDataAndLogin(product.emailSalles).then((account) => {
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

          const productData = {
            product,
            account,
          };
          this.combinedData.push(productData);
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

  filterCombinedData(): Array<{ product: any; account: any }> {
    if (this.selectedCategory === 'all') {
      return this.combinedData;
    }
    return this.combinedData.filter(
      (combinedData) => combinedData.product.category === this.selectedCategory
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

  addToCart(combinedItem: { product: Product; account: any }): void {
    const productWithImages = {
      ...combinedItem,
      imageUrls: this.productImages[combinedItem.product.id]?.urls || [], // Inclui as URLs carregadas
    };
    this.cartService.add(productWithImages);
  }

}
