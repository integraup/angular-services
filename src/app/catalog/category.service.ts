import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";


export interface Category {
  id?: string;
  name: string;
  description: string;
  emailSalles: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseCategoryUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app';
  private readonly apiUrl = 'https://us-central1-limp-2f1d4.cloudfunctions.net/app/get-credentials';
  credentials: any;

  constructor(private httpClient: HttpClient) {


    // this.getCredentials().subscribe({
    //   next: (data) => (this.credentials = data),
    //   error: (err) => console.error('Erro ao obter credenciais:', err),
    // });

    // this.headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${this.credentials}`,
    // });

  }

  // getCredentials(): Observable<any> {
  //   return this.httpClient.get<any>(this.apiUrl);
  // }

  // GET: Listar todas as categorias
  getCategories(emailSalles: string): Observable<Category[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = new HttpParams().set('emailSalles', emailSalles);

    return this.httpClient.get<Category[]>(`${this.baseCategoryUrl}/categories`, { params, headers }).pipe(
      catchError((error) => {
        console.error('Erro ao listar categorias:', error);
        return throwError(error);
      })
    );
  }

// POST: Criar uma nova categoria
createCategory(category: Category): Observable<Category> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return this.httpClient
    .post<Category>(`${this.baseCategoryUrl}/categories`, category, {
      headers: headers,
    })
    .pipe(
      catchError((error) => {
        console.error("Erro ao criar categoria:", error);
        return throwError(() => new Error('Erro ao criar Categoria.'));
      })
    );
}


  // PUT: Atualizar uma categoria existente
  updateCategory(id: string, category: Category): Observable<Category> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.put<Category>(`${this.baseCategoryUrl}/categories/${id}`, category, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar categoria:', error);
        return throwError(error);
      })
    );
  }

  // DELETE: Excluir uma categoria
  deleteCategory(id: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.delete<{ message: string }>(`${this.baseCategoryUrl}/categories/${id}`, { headers: headers }).pipe(
      catchError(error => {
        console.error('Erro ao excluir categoria:', error);
        return throwError(error);
      })
    );
  }
}
