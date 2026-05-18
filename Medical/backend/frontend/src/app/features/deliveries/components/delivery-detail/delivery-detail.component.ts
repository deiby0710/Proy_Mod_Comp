import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Delivery } from '../../models/delivery';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {
  delivery?: Delivery;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private service: DeliveryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(id).subscribe({
      next: (delivery) => {
        this.delivery = delivery;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Entrega no encontrada',
          text: 'No fue posible cargar el registro de entrega.'
        });
        this.cdr.detectChanges();
      }
    });
  }
}
