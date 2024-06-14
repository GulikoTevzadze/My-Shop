import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../types/product';

@Pipe({
  name: 'productsFilter',
  standalone: true,
})
export class ProductsFilterPipe implements PipeTransform {
  transform(value: Product[], searcKey: string): Product[] {
    const key = searcKey.toLowerCase();
    return value.filter(
      (prod) =>
        prod.title.toLowerCase().includes(key) || prod.description.toLowerCase().includes(key)
    );
  }
}
