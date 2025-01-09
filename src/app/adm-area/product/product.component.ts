import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '@catalog/category.service';
import { ProductService } from '@catalog/products.service';
import { NotificationService, NotificationType } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';
import { Product } from '@shared/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  emailSalles: string;
  categories: Category[] = [];
  newProduct: Product = { id: "0", name: '', emailSalles: '', description: '', imageUrls: [], category: '', price: 0, discount: 0 };
  uploadInProgress = false;
  selectedProduct: Product = { id: "0", name: '', emailSalles: '', description: '', imageUrls: [], category: '', price: 0, discount: 0 };
  isEditing: boolean = false;
  selectedImages: File[] = [];
  selectedImagesPreview: string[] = [];
  selectedImagesPreviewUpdate: string[] = [];
  selectedImagesPreviewOriginalValue: string[] = [];
  selectedImagesPreviewCopyForDeleteAndCreate: string[] = [];
  copyImageDone: boolean;
  maxImages = 5;
  productId: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private firebaseAuthService: FirebaseAuthService
  ) {


  }

  ngOnInit(): void {
     this.loadProductCategory();
  }

  loadProductCategory(){
    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user?.email) {
        this.emailSalles = user.email;
        this.loadCategories(this.emailSalles);
        this.loadProducts(this.emailSalles);
      }
    });

  }

  uploadProductImages(product: Product): any {
    if (this.selectedImages.length === 0) return;
    this.productService.uploadImages(this.selectedImages, product).subscribe({
      next: (imageUrls: any) => {
        this.selectedImagesPreview = [];
        this.notificationService.notify(NotificationType.Success,'Imagens enviadas com sucesso!');
      if (this.isEditing) {
        this.selectedProduct.imageUrls = imageUrls.url;
      } else {
        this.newProduct.imageUrls = imageUrls.url;
      }
      },
      error: (err: any) => {
        console.error('Erro ao enviar imagens:', err);
          this.notificationService.notify(NotificationType.Error, 'Erro ao enviar imagens.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      const files = Array.from(input.files);
      if (files.length + this.selectedImages.length > this.maxImages) {
           this.notificationService.notify(NotificationType.Error, 'Você pode adicionar no máximo 5 imagens.');
        return;
      }
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          this.selectedImages.push(file);
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImagesPreview.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (this.selectedImages.length === 0) return;

    this.selectedProduct.imageUrls.push(this.selectedImages[0].name);

    this.productService.uploadImages(this.selectedImages,  this.selectedProduct).subscribe({
      next: (imageUrls: any) => {
        this.updateProduct();

      },
      error: (err: any) => console.error('Erro ao carregar produtos:', err),
    });
  }


  loadProducts(emailSalles: string): void {
    this.productService.getProducts(emailSalles).subscribe({
      next: (products: any) => (this.products = products),
      error: (err: any) => console.error('Erro ao carregar produtos:', err),
    });
  }

  loadCategories(emailSalles: string): void {
    this.categoryService.getCategories(emailSalles).subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  addProduct(): void {

    this.newProduct.emailSalles = this.emailSalles;

    if (!this.newProduct.imageUrls) {
      this.newProduct.imageUrls = [];
    }


    this.selectedImages.map(i => {
      this.newProduct.imageUrls.push(i.name);
    });

    this.productService.createProduct(this.newProduct).subscribe({
      next: (product: any) => {
        if(this.products === null){
          this.products = [];
        }
        this.products.push(product);
        this.productId = product.id;
        //this.newProduct = { id: "0", name: '', description: '', emailSalles: '', imageUrls: [], category: '', price: 0, discount: 0 };
        if (!this.uploadInProgress) {
          this.uploadInProgress = true;
          this.uploadProductImages(product);
          this.uploadInProgress = false;

        }

        this.loadImage();
        this.notificationService.notify(
          NotificationType.Success,
          `Produto criado com sucesso.`
        );

      },
      error: (err: any) => console.error('Ero ao adicionar produto:', err),
    });
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.selectedImagesPreview = [];

     this.loadImage();

  }

  loadImage(){
    this.selectedProduct.imageUrls.map(i =>
      {
        this.productService.downloadFileFromStorage(this.selectedProduct.id, i).then((url: any) => {
         this.isEditing = true;
         if(this.selectedImagesPreview.length >= 0){
          this.selectedImagesPreview.push(url);
         }});
      })
  }

  getImageNameFromUrl(url: string): string {
    const basePath = url.split('?')[0];
    const imageName = basePath.split('/').pop();
    return imageName || '';
  }

  updateProduct(): void {
      if (this.selectedProduct.id && this.selectedProduct.id !== "0") {
        this.productService.updateProduct(this.selectedProduct.id.toString(), this.selectedProduct).subscribe({
        next: (updatedProduct: any) => {
          const index = this.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) this.products[index] = updatedProduct;
          this.selectedImagesPreview = [];
          this.notificationService.notify(
            NotificationType.Success,
            `Produto Atualizado com sucesso.`
          );
          this.cancelEdit();
        },
        error: (err: any) => console.error('Erro ao atualizar produto:', err),
      });
    }
  }

  deleteImage(index: number, img: string): void {
    this.selectedImagesPreview.splice(index, 1);
    this.selectedProduct.imageUrls.splice(index, 1);

    this.productService.updateProduct(this.selectedProduct.id.toString(), this.selectedProduct).subscribe({
      next: (updatedProduct: any) => {
              this.productService.deleteImage(img).subscribe({
                next: () => {
                  const index = this.products.findIndex((p) => p.id === updatedProduct.id);
                  if (index !== -1) this.products[index] = updatedProduct;
                  this.notificationService.notify(
                    NotificationType.Success,
                    `Imagem ${img} excluída com sucesso.`
                  );
                },
                error: (error) => {
                  console.error('Erro ao excluir a imagem:', error);
                  this.notificationService.notify(
                    NotificationType.Error,
                    `Erro ao excluir a imagem ${img}. Tente novamente.`
                  );
                },
              });

        this.notificationService.notify(
          NotificationType.Success,
          `Produto Atualizado com sucesso.`
        );

      },
      error: (err: any) => console.error('Erro ao atualizar produto:', err),
    });

  this.notificationService.notify(
      NotificationType.Success,
      `Imagem ${img} excluída com sucesso.`
    );

  }

  cancelEdit(): void {
    this.selectedProduct = { id: "0", name: '', emailSalles: '', description: '', imageUrls: [], category: '', price: 0, discount: 0 };
    this.isEditing = false;
    this.selectedImagesPreview = [];
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId.toString()).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== productId.toString());
      },
      error: (err: any) => console.error('Erro ao excluir produto:', err),
    });
  }
}
