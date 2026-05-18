import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;

  constructor(
    private service: PatientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar pacientes',
          text: 'No fue posible obtener el listado de pacientes.'
        });
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro de que desea eliminar este paciente?',
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

      this.deletePatient(id);
    });
  }

  private deletePatient(id: number): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.patients = this.patients.filter(patient => patient.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Paciente eliminado exitosamente',
          timer: 1800,
          showConfirmButton: false
        });
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar paciente',
          text: 'Intenta nuevamente.'
        });
      }
    });
  }
}
