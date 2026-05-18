import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id!: number;
  loading = false;

  idTypes = ['CC', 'TI', 'AS', 'CE', 'CN', 'MS', 'NI', 'PA', 'PE', 'PT', 'RC', 'SC'];
  epsOptions = ['EMSSANAR EPS SAS', 'MALLAMAS EPS', 'SANITAS EPS', 'ASMET SALUD EPS', 'SOS SALUD'];

  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      identification: ['', [Validators.required, Validators.maxLength(30)]],
      id_type: ['', Validators.required],
      patient_name: ['', [Validators.required, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      birth_date: ['', Validators.required],
      eps: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.loadPatient();
    }
  }

  loadPatient(): void {
    this.loading = true;

    this.service.getById(this.id).subscribe({
      next: (data: Patient) => {
        this.form.patchValue(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar paciente',
          text: 'No fue posible obtener la informacion del paciente.'
        });
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

    const data: Patient = this.form.getRawValue();
    this.loading = true;

    const request = this.isEdit
      ? this.service.update(this.id, data)
      : this.service.create(data);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? 'Paciente actualizado exitosamente' : 'Paciente creado exitosamente',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/patients']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar paciente',
          text: 'Revisa los datos e intenta nuevamente.'
        });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
