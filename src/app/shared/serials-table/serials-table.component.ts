import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SerialsTableService } from '../serials-table.service';
import { SerialsDataSource } from '../serials.datasourse';
import { ISerialsFilters } from '../serialsFilters.model';

@Component({
  selector: 'app-serials-table',
  templateUrl: './serials-table.component.html',
  styleUrls: ['./serials-table.component.scss']
})
export class SerialsTableComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['name', 'season', 'network', 'premiere'];
  public dataSource: SerialsDataSource;

  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild('input', { static: true }) public input: ElementRef;
  private filters: ISerialsFilters;

  constructor(private _serialTableService: SerialsTableService) {
    this.filters = {} as ISerialsFilters;
    this.filters.nameSearch = '';
    this.filters.genre = '';
    this.filters.year = '';
    this.filters.sort = '';
   }
  public getColor(genre: string): string {
    let result = 'dark-item';
    switch (genre) {
      case 'drama':
        result = 'light-purple-item';
        break;
      case 'crime':
        result = 'purple-item';
        break;
        case 'tragedy':
        result = 'red-item';
        break;
        case 'dark comedy':
        result = 'light-dark-item';
        break;
      }
    return result;
  }

  public ngOnInit() {
    this.dataSource = new SerialsDataSource(this._serialTableService);
    this.dataSource.loadSerials(this.filters);
  }

  public ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                  this.filters.nameSearch = this.input.nativeElement.value;
                  if (this.paginator) {
                   this.paginator.pageIndex = 0;
                  }

                  this.dataSource.loadSerials(this.filters);
                })
            )
            .subscribe();
  }

  public onChangePage(event: PageEvent) {
    this.dataSource.loadSerials(this.filters, event.pageIndex, event.pageSize);
  }
  public onChangeGenre(event: MatSelectChange) {
    this.filters.genre = event.value;
    this.dataSource.loadSerials( this.filters);
  }
  public  onChangePremYear(event: MatSelectChange) {
    this.filters.year = event.value;
    this.dataSource.loadSerials( this.filters);
  }
  public sortData(event: Sort) {
    this.filters.sort = event.direction;
    this.dataSource.loadSerials( this.filters);
  }
}
