import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from 'spartan/button';
import { DeliveryService, Dealer } from '../../../shared/services/delivery.service';

export interface RutaEntrega {
  id: number;
  fecha: Date;
  dealer: Dealer | null;
  estado: 'pendiente' | 'en_curso' | 'completada';
}

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
  ],
  templateUrl: './route.html',
  styleUrls: ['./route.scss']
})
export class RoutePage implements OnInit {
  private deliveryService = inject(DeliveryService);

  rutas: RutaEntrega[] = [];
  dealers: Dealer[] = [];
  showCreateDialog = false;

  newRuta: Partial<RutaEntrega> = {
    fecha: new Date(),
    dealer: null,
    estado: 'pendiente'
  };

  loading = false;

  ngOnInit(): void {
    this.loadDealers();
    this.rutas = this.generarRutasEjemplo();
  }

  loadDealers(): void {
    this.deliveryService.getDealers().subscribe({
      next: (data) => {
        this.dealers = data.dealers.map((d: any) => ({
          id: d.id,
          nombre: `${d.firstName} ${d.lastName}`,
          telefono: d.cellPhone,
          licencia: d.identityCard,
          estado: 'activo'
        }));
      },
      error: (err) => {
        console.error('Error cargando dealers:', err);
        this.dealers = [
          { id: 1, nombre: 'Juan Pérez', telefono: '555-1234', licencia: 'ABC123', estado: 'activo' },
          { id: 2, nombre: 'María García', telefono: '555-5678', licencia: 'DEF456', estado: 'activo' },
          { id: 3, nombre: 'Carlos López', telefono: '555-9012', licencia: 'GHI789', estado: 'activo' }
        ];
      }
    });
  }

  generarRutasEjemplo(): RutaEntrega[] {
    return [
      {
        id: 1,
        fecha: new Date('2026-04-24'),
        dealer: { id: 1, nombre: 'Juan Pérez', telefono: '555-1234', licencia: 'ABC123', estado: 'activo' },
        estado: 'pendiente'
      },
      {
        id: 2,
        fecha: new Date('2026-04-25'),
        dealer: { id: 2, nombre: 'María García', telefono: '555-5678', licencia: 'DEF456', estado: 'activo' },
        estado: 'en_curso'
      },
      {
        id: 3,
        fecha: new Date('2026-04-23'),
        dealer: { id: 3, nombre: 'Carlos López', telefono: '555-9012', licencia: 'GHI789', estado: 'activo' },
        estado: 'completada'
      }
    ];
  }

  openCreateDialog(): void {
    this.newRuta = {
      fecha: new Date(),
      dealer: null,
      estado: 'pendiente'
    };
    this.showCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;
  }

  createRuta(): void {
    if (!this.newRuta.fecha || !this.newRuta.dealer) {
      alert('Por favor selecciona una fecha y un repartidor');
      return;
    }

    const nuevaRuta: RutaEntrega = {
      id: this.rutas.length + 1,
      fecha: this.newRuta.fecha,
      dealer: this.newRuta.dealer,
      estado: 'pendiente'
    };

    this.rutas.unshift(nuevaRuta);
    this.closeCreateDialog();
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_curso': return 'En Curso';
      case 'completada': return 'Completada';
      default: return estado;
    }
  }

  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}