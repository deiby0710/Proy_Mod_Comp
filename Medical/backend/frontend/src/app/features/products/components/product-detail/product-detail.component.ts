import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,MatButtonModule,
  MatCardModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {

  product?: Product;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}