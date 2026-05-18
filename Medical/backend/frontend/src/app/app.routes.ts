import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/home/components/module-menu/module-menu.component')
        .then(m => m.ModuleMenuComponent)
  },

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

  {
    path: 'patients',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/patients/components/patient-list/patient-list.component')
            .then(m => m.PatientListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/patients/components/patient-form/patient-form.component')
            .then(m => m.PatientFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/patients/components/patient-form/patient-form.component')
            .then(m => m.PatientFormComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/patients/components/patient-detail/patient-detail.component')
            .then(m => m.PatientDetailComponent)
      }
    ]
  },

  {
    path: 'deliveries',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/deliveries/components/delivery-list/delivery-list.component')
            .then(m => m.DeliveryListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/deliveries/components/delivery-form/delivery-form.component')
            .then(m => m.DeliveryFormComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/deliveries/components/delivery-detail/delivery-detail.component')
            .then(m => m.DeliveryDetailComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
