import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { DeliveryService, Dealer, CreateDealerDto } from '../../../shared/services/delivery.service';
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
  private cd = inject(ChangeDetectorRef);

  dealers: any[] = [];
  dropdownOpen = false;

  showDealerDialog = false;
  editingDealer: Dealer | null = null;

  loading = false;
  errorMessage = '';

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

  // 🔹 GET DEALERS
  loadDealers(): void {
    this.loading = true;
    this.deliveryService.getDealers().subscribe({
      next: (data) => {
        this.dealers = data.dealers;
        console.log('DEALERS', this.dealers);
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar dealers';
        this.loading = false;
      }
    });
  }

  onViewChange(view: string): void {
    if (view === 'overview') {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // 🔹 MODAL
  openNewDealerDialog(): void {
    this.editingDealer = null;
    this.newDealer = {
      nombre: '',
      telefono: '',
      email: '',
      licencia: '',
      vehiculo: '',
      estado: 'activo'
    };
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

  // 🔹 CREATE / UPDATE
  saveDealer(): void {
    this.loading = true;

    if (this.editingDealer) {
      this.deliveryService.updateDealer(this.editingDealer.id, this.newDealer)
        .subscribe({
          next: () => {
            this.loadDealers();
            this.closeDealerDialog();
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Error al actualizar dealer';
            this.loading = false;
          }
        });

    } else {
      this.deliveryService.createDealer(this.newDealer as Omit<Dealer, 'id'>)
        .subscribe({
          next: () => {
            this.loadDealers();
            this.closeDealerDialog();
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Error al crear dealer';
            this.loading = false;
          }
        });
    }
  }

  // 🔹 DELETE
  deleteDealer(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este dealer?')) return;

    this.loading = true;

    this.deliveryService.deleteDealer(id).subscribe({
      next: () => {
        this.loadDealers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al eliminar dealer';
        this.loading = false;
      }
    });
  }

  // 🔹 LOGOUT
  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
