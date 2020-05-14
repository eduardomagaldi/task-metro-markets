import {Injectable, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product';
import {ResponseProduct} from '../models/responseProduct';

@Injectable()
export class DataService {
  private readonly API_URL = 'https://app-search.prod.de.metro-marketplace.cloud/api/search';
  private readonly PRODUCT_PAGE_BASE_URL = 'https://www.metro.de/marktplatz/product/';
  private dataList: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  totalProductsCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  dataListUpdated: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor (private httpClient: HttpClient) {
    this.dataList.subscribe(() => {
      this.dataListUpdated.next(true);
    });
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

  /** CRUD METHODS */
  getProducts(ofset?: string): void {
    this.httpClient.get<{items: ResponseProduct[], totalCount: number}>(this.API_URL, {
      params: {
        offset: ofset || '0',
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

        this.totalProductsCount.next(data.totalCount);
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
    const dataList = this.dataList.value.slice();
    dataList.push(issue);
    this.dataList.next(dataList);
  }

  updateIssue (issue: Product): void {
    const foundIndex = this.dataList.value.findIndex(x => {
      return x.id === issue.id;
    });

    this.dataList.value[foundIndex] = issue;
  }

  deleteIssue (id: number): void {
    const dataList = this.dataList.value.filter((product) => product.id !== id);
    this.dataList.next(dataList);
  }

  find(id: number) {
    return this.dataList.value.find(x => x.id === id);
  }

  filter(filter: string) {
    return this.dataList.value.slice().filter((issue: Product) => {
      if (issue) {
        return issue.id.toString().toUpperCase().indexOf(filter) > -1 ||
          issue.name.toUpperCase().indexOf(filter) > -1 ||
          issue.price.toString().toUpperCase().indexOf(filter) > -1;
      }
    });
  }
}
