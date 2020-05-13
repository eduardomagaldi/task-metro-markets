import {DataSource} from '@angular/cdk/collections';
import {Product} from '../models/product';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {DataService} from './data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {map} from 'rxjs/operators';

export class ProductDataSource extends DataSource<Product> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Product[] = [];
  renderedData: Product[] = [];

  constructor(public exampleDatabase: DataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => {this.paginator.pageIndex = 0});
  }
  connect(): Observable<Product[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataListUpdated,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.exampleDatabase.getProducts();

    return merge(...displayDataChanges).pipe(map( () => {
      /**
       * FIND_ME Task 2
       * Implement filtering functionality
       * User will type in filter field and we will need to show items from state with that searched query in:
       * - id
       * - name
       * - price
       * SO it could be substring of one of the properties (owar in "Samowar")
       */
        const filter = this.filterChange.getValue().toUpperCase();

        this.filteredData = this.exampleDatabase.filter(filter);

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Product[]): Product[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    /**
     * FIND_ME Task 3
     * Implement sorting functionality
     * this.sort.active: string (id|name|url|price)
     * this.sort.direction: string (asc|desc)
     */
    return data.sort((a, b) => {
      if (a[this.sort.active] > b[this.sort.active]) {
        if (this.sort.direction === 'asc') {
          return -1;
        } else {
          return 1;
        }
      }

      if (a[this.sort.active] < b[this.sort.active]) {
        if (this.sort.direction === 'asc') {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    });
  }
}
