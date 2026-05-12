import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product'

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule,
    MatIconModule, MatSnackBarModule],
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
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar
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
    this.service.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.snack.open('Producto eliminado', 'Cerrar', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}