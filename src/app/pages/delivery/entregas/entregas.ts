import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from 'spartan/button';
import { RoutePage, RutaEntrega } from '../route/route';

export interface Paquete {
  id: number;
  paciente: string;
  direccion: string;
  ruta: RutaEntrega | null;
  estado: 'entregado' | 'no_entregado' | 'cancelado';
}

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
  ],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.scss']
})
export class EntregasPage implements OnInit {
  paquetes: Paquete[] = [];
  rutas: RutaEntrega[] = [];
  showAsignarDialog = false;
  paqueteSeleccionado: Paquete | null = null;
  rutaSeleccionada: RutaEntrega | null = null;

  ngOnInit(): void {
    this.paquetes = this.generarPaquetesEjemplo();
    this.rutas = this.generarRutasEjemplo();
  }

  generarPaquetesEjemplo(): Paquete[] {
    return [
      {
        id: 1,
        paciente: 'Juan Pérez',
        direccion: 'Av. Principal 123, Col. Centro',
        ruta: null,
        estado: 'no_entregado'
      },
      {
        id: 2,
        paciente: 'María García',
        direccion: 'Calle 5 #45, Col. San Ángel',
        ruta: { id: 2, fecha: new Date('2026-04-25'), dealer: null, estado: 'en_curso' },
        estado: 'no_entregado'
      },
      {
        id: 3,
        paciente: 'Carlos López',
        direccion: 'Blvd.华北 78, Col. Del Valle',
        ruta: { id: 3, fecha: new Date('2026-04-23'), dealer: null, estado: 'completada' },
        estado: 'entregado'
      },
      {
        id: 4,
        paciente: 'Ana Martínez',
        direccion: 'Av. UNAM 200, Col. Coyoacán',
        ruta: null,
        estado: 'cancelado'
      },
      {
        id: 5,
        paciente: 'Roberto Díaz',
        direccion: 'Calle 10 #12, Col. Roma',
        ruta: { id: 1, fecha: new Date('2026-04-24'), dealer: null, estado: 'pendiente' },
        estado: 'no_entregado'
      }
    ];
  }

  generarRutasEjemplo(): RutaEntrega[] {
    return [
      { id: 1, fecha: new Date('2026-04-24'), dealer: null, estado: 'pendiente' },
      { id: 2, fecha: new Date('2026-04-25'), dealer: null, estado: 'en_curso' },
      { id: 3, fecha: new Date('2026-04-23'), dealer: null, estado: 'completada' }
    ];
  }

  abrirAsignarRuta(paquete: Paquete): void {
    this.paqueteSeleccionado = paquete;
    this.rutaSeleccionada = null;
    this.showAsignarDialog = true;
  }

  cerrarAsignarDialog(): void {
    this.showAsignarDialog = false;
    this.paqueteSeleccionado = null;
    this.rutaSeleccionada = null;
  }

  asignarARuta(): void {
    if (!this.paqueteSeleccionado || !this.rutaSeleccionada) {
      alert('Por favor selecciona una ruta');
      return;
    }

    const index = this.paquetes.findIndex(p => p.id === this.paqueteSeleccionado!.id);
    if (index !== -1) {
      this.paquetes[index].ruta = this.rutaSeleccionada;
      this.paquetes[index].estado = 'no_entregado';
    }

    this.cerrarAsignarDialog();
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