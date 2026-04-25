import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from 'spartan/button';

export interface RutaEntrega {
  id: number;
  fecha: Date;
  estado: 'pendiente' | 'en_curso' | 'completada';
}

export interface Paquete {
  id: number;
  paciente: string;
  direccion: string;
  ruta: RutaEntrega | null;
  estado: 'entregado' | 'no_entregado' | 'cancelado';
}

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
  ],
  templateUrl: './delivery-detail.html',
  styleUrls: ['./delivery-detail.scss']
})
export class DeliveryDetailPage implements OnInit {
  paquetes: Paquete[] = [];
  paquetesFiltrados: Paquete[] = [];

  ngOnInit(): void {
    this.paquetes = this.generarPaquetesEjemplo();
    this.filtrarPaquetesConRuta();
  }

  generarPaquetesEjemplo(): Paquete[] {
    return [
      {
        id: 1,
        paciente: 'Juan Pérez',
        direccion: 'Av. Principal 123, Col. Centro',
        ruta: { id: 1, fecha: new Date('2026-04-24'), estado: 'pendiente' },
        estado: 'no_entregado'
      },
      {
        id: 2,
        paciente: 'María García',
        direccion: 'Calle 5 #45, Col. San Ángel',
        ruta: { id: 2, fecha: new Date('2026-04-25'), estado: 'en_curso' },
        estado: 'no_entregado'
      },
      {
        id: 3,
        paciente: 'Carlos López',
        direccion: 'Blvd.华北 78, Col. Del Valle',
        ruta: { id: 3, fecha: new Date('2026-04-23'), estado: 'completada' },
        estado: 'entregado'
      },
      {
        id: 4,
        paciente: 'Ana Martínez',
        direccion: 'Av. UNAM 200, Col. Coyoacán',
        ruta: null,
        estado: 'no_entregado'
      },
      {
        id: 5,
        paciente: 'Roberto Díaz',
        direccion: 'Calle 10 #12, Col. Roma',
        ruta: { id: 1, fecha: new Date('2026-04-24'), estado: 'pendiente' },
        estado: 'cancelado'
      }
    ];
  }

  filtrarPaquetesConRuta(): void {
    this.paquetesFiltrados = this.paquetes.filter(p => p.ruta !== null);
  }

  cambiarEstado(paquete: Paquete, nuevoEstado: 'entregado' | 'cancelado'): void {
    const index = this.paquetes.findIndex(p => p.id === paquete.id);
    if (index !== -1) {
      this.paquetes[index].estado = nuevoEstado;
      this.filtrarPaquetesConRuta();
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'entregado': return 'Entregado';
      case 'no_entregado': return 'No Entregado';
      case 'cancelado': return 'Cancelado';
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