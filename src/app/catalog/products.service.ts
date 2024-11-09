import { Product } from "@shared/product.model"
import { FirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ProductService {
  private auth = getAuth(this.firebaseApp);

  constructor(private httpClient: HttpClient, private firebaseApp: FirebaseApp) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>('https://getproducts-122896672046.us-central1.run.app/')
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar produtos:', error);
          return throwError(error); // Repassa o erro para que possa ser tratado onde a função é chamada
        })
      );
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
