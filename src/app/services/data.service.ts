import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product';
import {ResponseProduct} from '../models/responseProduct';

@Injectable()
export class DataService {
  private readonly API_URL = 'https://app-search.prod.de.metro-marketplace.cloud/api/search';
  private readonly PRODUCT_PAGE_BASE_URL = 'https://www.metro.de/marktplatz/product/';

  dataList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  totalProductsCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Product[] {
    return this.dataList.value;
  }

  /**
   * FIND_ME Task 4
   * Currently data from Add and Edit modals is translated to
   * app component through dialogData.
   *
   * That is bad because we need some variable in DataService only for transporting.
   * And also because In that case DataService violates Single Responsibility.
   *
   * Please refactor that part by getting rid of dialogData, while requesting Database only from app component.
   *
   * Hint for non-angular - @Output EventEmitter
   */
  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getProducts(): void {
    this.httpClient.get<{items: ResponseProduct[], totalCount: number}>(this.API_URL, {
      params: {
        offset: '0',
        limit: '10',
        'filter[top][phrase]': 'samowar teekocher',
        'sort[price]': 'desc'
      }
    }).subscribe((data) => {
        /**
         * FIND_ME Task 1
         * fix issues to save items and totalCount from response to local state
         */
        this.dataList.next(data.items.map(el => this.mapToProduct(el)));
        this.dataList.totalProductsCount = data.totalCount;
      });
  }

  mapToProduct(data: ResponseProduct): Product {
    const { id, name, image, bestOffer: { priceVatExcluded }} = data;
    return {
      id,
      name,
      image,
      price: parseFloat(priceVatExcluded),
      url: `${this.PRODUCT_PAGE_BASE_URL}${id}`
    };
  }

  /**
   * FIND_ME Task 5
   * After you've removed dialogData, we can use addIssue, updateIssue and deleteIssue in a proper way.
   *
   * Please refactor these functions and move all logic from new @Outputs and from app.component in data service.
   * That will allow us to have proper abstraction layer between local items list and component,
   * and not to expose details of our items storage.
   *
   * Aim is to remove access to this.exampleDatabase.dataList.value from outside of this service and make `dataList` private.
   */
  addIssue (issue: Product): void {
    this.dialogData = issue;
  }

  updateIssue (issue: Product): void {
    this.dialogData = issue;
  }

  deleteIssue (id: number): void {}
}
