import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {fromEvent} from 'rxjs';
import {ProductDataSource} from './services/productDataSource.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ViewDialogComponent} from './dialogs/view/view.dialog.component';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['image', 'id', 'name', 'url', 'price', 'actions'];
  exampleDatabase: DataService | null;
  dataSource: ProductDataSource | null;
  totalCount: number;
  pageEvent: PageEvent;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {
        product: new Product(),
        dataService: this.exampleDatabase,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }

  viewProduct(id: number) {
    this.dialog.open(ViewDialogComponent, {
      data: {
        product: this.exampleDatabase.find(id)
      }
    });
  }

  startEdit(id: number) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        product: this.exampleDatabase.find(id),
        dataService: this.exampleDatabase,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        product: this.exampleDatabase.find(id),
        dataService: this.exampleDatabase,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ProductDataSource(this.exampleDatabase, this.paginator, this.sort);
    this.exampleDatabase.totalProductsCount.subscribe(val => this.totalCount = val);
    fromEvent(this.filter.nativeElement, 'keyup').pipe(debounceTime(150), distinctUntilChanged())
      .subscribe(() => {
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  /**
   * FIND_ME Task 7 EXTRA
   * As you can see now we have 10 items in state but we have more items in total.
   * That can be checked in response totalCount (if for some reason totalCount less than 10, please change filter[top][phrase] :P)
   *
   * Challenge is to have lazy loading items, on page change we want to request next N products (based on page size).
   * And also append those items to the local state of table.
   *
   * This function is being executed on every pagination request.
   */
  getServerData(event: PageEvent) {
    this.exampleDatabase.getProducts((event.pageIndex * event.pageSize).toString());

    return event;
  }
}
