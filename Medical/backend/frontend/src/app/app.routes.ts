import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/products/components/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/products/components/product-form/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/products/components/product-form/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/products/components/product-detail/product-detail.component')
            .then(m => m.ProductDetailComponent)
      }
    ]
  },

  // 🔥 ESTA LÍNEA ES CLAVE
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // 🔥 opcional pero recomendado
  { path: '**', redirectTo: 'products' }
];