import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, map, Subject, Subscription, tap } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListAltComponent  {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;
  selectedCategoryId= 1;

  // products: Product[] = [];
  // sub!: Subscription;

  selectedProduct$ = this.productService.selectedProduct$;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategory$
  .pipe(
          tap(data => console.log('Products: ', JSON.stringify(data))),
          catchError(err => {
            this.errorMessageSubject.next(err);
            return EMPTY;
          })
        );

    // productsSimpleFilter$ = this.productService.productsWithCategory$
    // .pipe(
    //   map(products => {
    //     products.filter(product => this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true)
    //   })
    // )

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
