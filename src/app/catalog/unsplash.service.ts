import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private baseUrl = 'https://api.unsplash.com/search/photos';
  private clientId = 'JJPy87NT6k4NQe1SpPhzdO1DjQWjSnfWfHE2Ndt4IHI';

  constructor(private http: HttpClient) {}

  /**
   * Fetch photos from Unsplash based on a query.
   * @param query Search term for photos.
   * @param perPage Number of photos to return per page (optional).
   * @param page The page of results to fetch (optional).
   * @returns Observable with the API response.
   */
  searchPhotos(query: string, perPage: number = 10, page: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Client-ID ${this.clientId}`,
    });

    const params = new HttpParams()
      .set('query', query)
      .set('per_page', perPage.toString())
      .set('page', page.toString());

    return this.http.get(this.baseUrl, { headers, params });
  }
}
