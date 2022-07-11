import { ChangeDetectionStrategy, Component, OnInit,  } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, startWith, Subject, tap } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
  ])
  .pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(product=>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )
    ),
  )
    categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    ) { }

  ngOnInit(): void {

  }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
