import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule,
    MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  loading = true;
  private pollingSub?: Subscription;

  constructor(
    private service: ProductService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();

    this.pollingSub = interval(5000).subscribe(() => {
      this.zone.run(() => this.load());
    });
  }

  private load(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en polling:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  delete(id: number) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro de que desea eliminar este producto?',
      text: 'Esta accion no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.deleteProduct(id);
    });
  }

  private deleteProduct(id: number): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado exitosamente',
          timer: 1800,
          showConfirmButton: false
        });
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar producto',
          text: 'Intenta nuevamente.'
        });
      }
    });
  }
}
