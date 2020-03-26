import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISerials } from './serials.model';
import { ISerialsFilters } from './serialsFilters.model';

@Injectable({
  providedIn: 'root'
})
export class SerialsTableService {

  constructor(private http: HttpClient) { }

  public getSerials(filters: ISerialsFilters, pageNumber: number, pageSize: number): Observable<ISerials[]> {
    return this.http.get<ISerials[]>('assets/data/serials.json').pipe(
      map((data) => {
        if (filters.nameSearch) {
          data = data.filter((seria) => seria.name.trim().toLowerCase().search(filters.nameSearch.toLowerCase()) >= 0);
       }
        if (filters.genre) {
        data = data.filter((seria) => seria.genres.join().toLowerCase().search(filters.genre.toLowerCase()) >= 0);
       }
        if (filters.year) {
        data = data.filter((seria) => seria.premiere.search(filters.year) >= 0);
       }

        if (filters.sort === 'desc') {
        data = data.reverse();
        }

        const initialPos = pageNumber * pageSize;
        data = data.slice(initialPos, initialPos + pageSize);
        return data;
      })
    );
  }

  public getAmountSerials(filters: ISerialsFilters): Observable<number> {
    return this.http.get<ISerials[]>('assets/data/serials.json').pipe(
      map((data) => {
        if (filters.nameSearch) {
          data = data.filter((seria) => seria.name.trim().toLowerCase().search(filters.nameSearch.toLowerCase()) >= 0);
       }
        if (filters.genre) {
        data = data.filter((seria) => seria.genres.join().toLowerCase().search(filters.genre.toLowerCase()) >= 0);
       }
        if (filters.year) {
        data = data.filter((seria) => seria.premiere.search(filters.year) >= 0);
       }
        return data.length;
      })
    );
  }
}
