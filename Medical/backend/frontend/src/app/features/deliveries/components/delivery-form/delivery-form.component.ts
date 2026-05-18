import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { Patient } from '../../../patients/models/patient';
import { PatientService } from '../../../patients/services/patient.service';
import { Product } from '../../../products/models/product';
import { ProductService } from '../../../products/services/product.service';
import { Delivery, DeliveryItem } from '../../models/delivery';
import { DeliveryService } from '../../services/delivery.service';

interface DeliveryItemDraft extends DeliveryItem {
  product_id: number;
  available_quantity: number;
}

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.css']
})
export class DeliveryFormComponent implements OnInit {
  deliveryForm!: FormGroup;
  medicineForm!: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedPatient?: Patient;
  selectedProduct?: Product;
  items: DeliveryItemDraft[] = [];
  editingIndex: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private productService: ProductService,
    private deliveryService: DeliveryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      registration_date: [this.today(), Validators.required],
      identification: ['', Validators.required],
      id_type: [{ value: '', disabled: true }],
      patient_name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      eps: [{ value: '', disabled: true }],
      note: ['']
    });

    this.medicineForm = this.fb.group({
      product_search: ['', Validators.required],
      generic_name: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }],
      pharmaceutic_form: [{ value: '', disabled: true }],
      final_date: [{ value: '', disabled: true }],
      cum: [{ value: '', disabled: true }],
      prescribed_quantity: [1, [Validators.required, Validators.min(1)]],
      dispensed_quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.loadProducts();
    this.watchPatientIdentification();
    this.watchProductSearch();
  }

  displayProduct(product: Product | string): string {
    return typeof product === 'string' ? product : product?.comercial_name ?? '';
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.medicineForm.patchValue({
      product_search: product,
      generic_name: product.generic_name,
      price: product.price,
      pharmaceutic_form: product.pharmaceutic_form,
      final_date: product.final_date,
      cum: product.cum
    });
  }

  addOrUpdateMedicine(): void {
    if (!this.selectedProduct || this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un medicamento',
        text: 'Debes seleccionar un medicamento del stock antes de añadirlo.'
      });
      return;
    }

    const prescribedQuantity = Number(this.medicineForm.get('prescribed_quantity')?.value);
    const dispensedQuantity = Number(this.medicineForm.get('dispensed_quantity')?.value);

    if (dispensedQuantity > this.availableStockForSelection()) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: 'No tenemos las suficientes cantidades en el stock para este medicamento.'
      });
      return;
    }

    const item: DeliveryItemDraft = {
      product_id: this.selectedProduct.id!,
      product_name: this.selectedProduct.comercial_name,
      generic_name: this.selectedProduct.generic_name,
      price: Number(this.selectedProduct.price),
      pharmaceutic_form: this.selectedProduct.pharmaceutic_form,
      final_date: this.selectedProduct.final_date,
      cum: this.selectedProduct.cum,
      prescribed_quantity: prescribedQuantity,
      dispensed_quantity: dispensedQuantity,
      available_quantity: this.selectedProduct.quantity
    };

    if (this.editingIndex === null) {
      this.items = [...this.items, item];
    } else {
      this.items = this.items.map((current, index) => index === this.editingIndex ? item : current);
      this.editingIndex = null;
    }

    this.clearMedicineForm();
  }

  editItem(index: number): void {
    const item = this.items[index];
    const product = this.products.find(current => current.id === item.product_id);

    if (!product) {
      return;
    }

    this.editingIndex = index;
    this.selectProduct(product);
    this.medicineForm.patchValue({
      prescribed_quantity: item.prescribed_quantity,
      dispensed_quantity: item.dispensed_quantity
    });
  }

  removeItem(index: number): void {
    this.items = this.items.filter((_, currentIndex) => currentIndex !== index);

    if (this.editingIndex === index) {
      this.clearMedicineForm();
    }
  }

  save(): void {
    if (this.deliveryForm.invalid || !this.selectedPatient) {
      this.deliveryForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Paciente requerido',
        text: 'Ingresa una identificacion valida para autocompletar el paciente.'
      });
      return;
    }

    if (!this.items.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Agrega medicamentos',
        text: 'Debes añadir al menos un medicamento a la entrega.'
      });
      return;
    }

    const delivery: Delivery = {
      registration_date: this.deliveryForm.get('registration_date')?.value,
      patient: this.selectedPatient.id!,
      note: this.deliveryForm.get('note')?.value || '',
      items: this.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        generic_name: item.generic_name,
        price: item.price,
        pharmaceutic_form: item.pharmaceutic_form,
        final_date: item.final_date,
        cum: item.cum,
        prescribed_quantity: item.prescribed_quantity,
        dispensed_quantity: item.dispensed_quantity
      }))
    };

    this.loading = true;

    this.deliveryService.create(delivery).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Entrega guardada exitosamente',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/deliveries']);
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'No fue posible guardar la entrega',
          text: this.resolveErrorMessage(error)
        });
        this.cdr.detectChanges();
      }
    });
  }

  private loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar stock',
          text: 'No fue posible cargar los medicamentos del inventario.'
        });
      }
    });
  }

  private watchPatientIdentification(): void {
    this.deliveryForm.get('identification')?.valueChanges
      .pipe(debounceTime(450), distinctUntilChanged())
      .subscribe((identification: string) => {
        this.clearPatientFields();

        if (!identification) {
          return;
        }

        this.patientService.getByIdentification(identification).subscribe({
          next: (patient) => {
            this.selectedPatient = patient;
            this.deliveryForm.patchValue({
              id_type: patient.id_type,
              patient_name: patient.patient_name,
              phone: patient.phone,
              eps: patient.eps
            }, { emitEvent: false });
            this.cdr.detectChanges();
          },
          error: () => {
            this.selectedPatient = undefined;
          }
        });
      });
  }

  private watchProductSearch(): void {
    this.medicineForm.get('product_search')?.valueChanges.subscribe((value) => {
      if (typeof value !== 'string') {
        return;
      }

      this.selectedProduct = undefined;
      const term = value.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product =>
        product.comercial_name.toLowerCase().includes(term) ||
        product.generic_name.toLowerCase().includes(term) ||
        product.cum.toLowerCase().includes(term)
      );
    });
  }

  private availableStockForSelection(): number {
    if (!this.selectedProduct) {
      return 0;
    }

    const alreadySelected = this.items.reduce((total, item, index) => {
      if (item.product_id !== this.selectedProduct?.id || index === this.editingIndex) {
        return total;
      }

      return total + item.dispensed_quantity;
    }, 0);

    return this.selectedProduct.quantity - alreadySelected;
  }

  private clearMedicineForm(): void {
    this.selectedProduct = undefined;
    this.editingIndex = null;
    this.medicineForm.reset({
      product_search: '',
      generic_name: '',
      price: '',
      pharmaceutic_form: '',
      final_date: '',
      cum: '',
      prescribed_quantity: 1,
      dispensed_quantity: 1
    });
  }

  private clearPatientFields(): void {
    this.selectedPatient = undefined;
    this.deliveryForm.patchValue({
      id_type: '',
      patient_name: '',
      phone: '',
      eps: ''
    }, { emitEvent: false });
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private resolveErrorMessage(error: any): string {
    const stockMessage = error?.error?.stock;

    if (stockMessage) {
      return Array.isArray(stockMessage) ? stockMessage[0] : stockMessage;
    }

    return 'Revisa los datos e intenta nuevamente.';
  }
}
