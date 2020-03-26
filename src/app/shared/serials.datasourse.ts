import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { SerialsTableService } from './serials-table.service';
import { ISerials } from './serials.model';
import { ISerialsFilters } from './serialsFilters.model';

export class SerialsDataSource implements DataSource<ISerials> {
    public maxLength: number;

    private serialsSubject = new BehaviorSubject<ISerials[]>([]);

    constructor(private _serialTableService: SerialsTableService) {
    }

    public loadSerials(filters: ISerialsFilters, pageIndex: number = 0, pageSize: number = 5) {
        this._serialTableService.getSerials(filters, pageIndex, pageSize)
        .subscribe((data) => this.serialsSubject.next(data));

        this._serialTableService.getAmountSerials(filters).subscribe((amount) => this.maxLength = amount);
    }

    public connect(collectionViewer: CollectionViewer): Observable<ISerials[]> {
        return this.serialsSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.serialsSubject.complete();
    }

}
