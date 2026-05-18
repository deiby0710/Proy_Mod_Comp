import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ModuleOption {
  title: string;
  icon: string;
  route?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-module-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './module-menu.component.html',
  styleUrls: ['./module-menu.component.css']
})
export class ModuleMenuComponent {
  modules: ModuleOption[] = [
    {
      title: 'Pacientes',
      icon: 'groups',
      route: '/patients'
    },
    {
      title: 'Entregas',
      icon: 'local_shipping',
      route: '/deliveries'
    },
    {
      title: 'Pendientes',
      icon: 'pending_actions',
      disabled: true
    },
    {
      title: 'Stock / Inventario',
      icon: 'inventory_2',
      route: '/products'
    }
  ];
}
