import { Product } from "@shared/product.model"
import { FirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { Injectable } from "@angular/core";
import { catchError, from, Observable, switchMap, throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
@Injectable({ providedIn: "root" })
export class ProductService {
  private readonly maxImageWidth = 800; // Máximo em pixels
  private readonly maxImageHeight = 800;
  private baseUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app';

  private auth = getAuth(this.firebaseApp);
  private readonly apiUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app/get-credentials';
  credentials: any;
  constructor(private httpClient: HttpClient, private firebaseApp: FirebaseApp) {

    this.getCredentials().subscribe({
      next: (data) => (this.credentials = data),
      error: (err) => console.error('Erro ao obter credenciais:', err),
    });

  }

  getCredentials(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl);
  }

 downloadFileFromStorage(productId: string, fileName: string): Promise<string> {
    const storage = getStorage();

    // Construa o caminho do arquivo no bucket
    const filePath = `products/${productId}/${fileName}`;

    // Obtenha a URL de download
    return getDownloadURL(ref(storage, filePath))
      .then((url) => {
        // console.log('URL do arquivo:', url);
        return url;
      })
      .catch((error) => {
        console.error('Erro ao buscar arquivo no Storage:', error);
        throw error;
      });
  }

  // GET: Listar todas as categorias
  getProducts(emailSalles: string): Observable<Product[]> {
    return this.getCredentials().pipe(
      catchError((error) => {
        console.error('Erro ao obter credenciais:', error);
        return throwError(() => new Error('Erro ao obter credenciais.'));
      }),
      switchMap((credentials) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        const params = new HttpParams().set('emailSalles', emailSalles);

        return this.httpClient.get<Product[]>(`${this.baseUrl}/products`, { params, headers }).pipe(
          catchError((error) => {
            console.error('Erro ao listar categorias:', error);
            return throwError(error);
          })
        );
      })
    );
  }


  getProductsByEmail(email: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/get-products-by-email?email=${email}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar produtos por email:', error);
        return throwError(error);
      })
    );
  }

  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<Product>(`${this.baseUrl}/products`, product, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao criar produto:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(productId: string, updatedProduct: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.put<Product>(`${this.baseUrl}/products/${productId}`, updatedProduct, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar produto:', error);
        return throwError(error);
      })
    );
  }

  deleteProduct(productId: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.delete<{ message: string }>(`${this.baseUrl}/products/${productId}`, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao excluir produto:', error);
        return throwError(error);
      })
    );
  }

  deleteImage(filePath: string): Observable<void> {
    const storage = getStorage();

    // Cria uma referência para o arquivo no Firebase Storage
    const fileRef = ref(storage, filePath);

    // Chama o método delete() e converte para um Observable
    return from(deleteObject(fileRef));
  }

  uploadImages(files: File[], product: Product): Observable<any[]> {
    const storage = getStorage();

    const uploadPromises = files.map(file => {
      // Cria uma referência para o arquivo no Firebase Storage
      const fileRef = ref(storage, `products/${product.id}/${file.name}`);

      // Faz o upload do arquivo e retorna uma Promise para ser resolvida
      return uploadBytes(fileRef, file).then(snapshot => {
        return {
          name: snapshot.ref.name,
          fullPath: snapshot.ref.fullPath,
          url: snapshot.ref.fullPath // Pode adicionar lógica para obter a URL após o upload, se necessário
        };
      });
    });


    // Retorna um Observable que emite um array de resultados após todos os uploads serem concluídos
    return from(Promise.all(uploadPromises));
  }


  private resizeImage(file: File): Observable<Blob> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          let { width, height } = img;

          // Mantém a proporção da imagem
          if (width > this.maxImageWidth || height > this.maxImageHeight) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
              width = this.maxImageWidth;
              height = this.maxImageWidth / aspectRatio;
            } else {
              height = this.maxImageHeight;
              width = this.maxImageHeight * aspectRatio;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                observer.next(blob);
                observer.complete();
              } else {
                observer.error(new Error('Erro ao converter o canvas em blob.'));
              }
            },
            'image/jpeg',
            0.8 // Qualidade da compressão
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }


  // getProducts(): Observable<Product[]> {
  //   return new Observable(observer => {
  //     this.auth.currentUser?.getIdToken().then((idToken) => {
  //       const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);

  //       // Requisição HTTP com cabeçalho de autorização
  //       this.httpClient
  //         .get<Product[]>('https://getproducts-122896672046.us-central1.run.app/', { headers })
  //         .subscribe(
  //           products => {
  //             observer.next(products);
  //             observer.complete();
  //           },
  //           error => observer.error(error)
  //         );
  //     }).catch(error => observer.error(error));
  //   });
  // }
}
