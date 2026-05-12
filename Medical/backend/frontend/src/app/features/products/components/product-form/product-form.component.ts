import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatCardModule, MatSnackBarModule, MatIconModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;

  isEdit = false;
  id!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private service: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      comercial_name: ['', [Validators.required, Validators.maxLength(255)]],
      generic_name: ['', [Validators.required, Validators.maxLength(255)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      lote: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      pharmaceutic_form: ['', [Validators.required, Validators.maxLength(100)]],
      cum: ['', [Validators.required, Validators.maxLength(100)]],
      final_date: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;

    this.service.getById(this.id).subscribe({
      next: (data: Product) => {
        this.form.patchValue(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Error al cargar producto', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: Product = this.form.getRawValue();
    this.loading = true;

    const request = this.isEdit
      ? this.service.update(this.id, data)
      : this.service.create(data);

    request.subscribe({
      next: () => {
        this.snack.open(
          this.isEdit ? 'Producto actualizado' : 'Producto creado',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: () => {
        this.snack.open('Error al guardar producto', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}