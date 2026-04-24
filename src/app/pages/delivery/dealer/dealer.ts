import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { DeliveryService, Dealer } from '../delivery.service';
import { AuthService } from '../../../shared/services/auth.service';
import { HlmButtonImports } from 'spartan/button';

@Component({
  selector: 'app-dealer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    HlmButtonImports,
  ],
  templateUrl: './dealer.html',
  styleUrls: ['./dealer.scss'],
})
export class DealerPage implements OnInit {
  private deliveryService = inject(DeliveryService);
  private authService = inject(AuthService);
  private router = inject(Router);

  dealers: Dealer[] = [];
  dropdownOpen = false;

  showDealerDialog = false;
  editingDealer: Dealer | null = null;

  newDealer: Partial<Dealer> = {
    nombre: '',
    telefono: '',
    email: '',
    licencia: '',
    vehiculo: '',
    estado: 'activo'
  };

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    this.dealers = this.deliveryService.getDealers();
  }

  onViewChange(view: string): void {
    if (view === 'overview') {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  openNewDealerDialog(): void {
    this.editingDealer = null;
    this.newDealer = { nombre: '', telefono: '', email: '', licencia: '', vehiculo: '', estado: 'activo' };
    this.showDealerDialog = true;
  }

  openEditDealerDialog(dealer: Dealer): void {
    this.editingDealer = dealer;
    this.newDealer = { ...dealer };
    this.showDealerDialog = true;
  }

  closeDealerDialog(): void {
    this.showDealerDialog = false;
    this.editingDealer = null;
  }

  saveDealer(): void {
    if (this.editingDealer) {
      this.deliveryService.updateDealer(this.editingDealer.id, this.newDealer);
    } else {
      this.deliveryService.createDealer(this.newDealer as Omit<Dealer, 'id'>);
    }
    this.loadDealers();
    this.closeDealerDialog();
  }

  deleteDealer(id: number): void {
    this.deliveryService.deleteDealer(id);
    this.loadDealers();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}