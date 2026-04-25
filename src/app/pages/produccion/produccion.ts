import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from 'spartan/button';
import { HlmCardImports } from 'spartan/card';

export interface OrdenProduccion {
  id: number;
  fecha: Date;
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'delivery';
  paciente?: Paciente;
  recetas?: Receta[];
}

export interface Paciente {
  id: number;
  nombre: string;
  estado: string;
}

export interface Receta {
  id: number;
  nombre: string;
  tipo: string;
  cantidad: number;
}

@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
    HlmCardImports,
  ],
  templateUrl: './produccion.html',
  styleUrls: ['./produccion.scss']
})
export class ProduccionPage implements OnInit {
  ordenes: OrdenProduccion[] = [];
  ordenSeleccionada: OrdenProduccion | null = null;

  ngOnInit(): void {
    this.ordenes = this.generarOrdenesEjemplo();
  }

  generarOrdenesEjemplo(): OrdenProduccion[] {
    return [
      {
        id: 1,
        fecha: new Date('2026-04-24'),
        estado: 'pendiente',
        paciente: {
          id: 1,
          nombre: 'Juan Pérez',
          estado: 'activo'
        },
        recetas: [
          { id: 1, nombre: 'Ensalada de quinoa', tipo: 'Almuerzo', cantidad: 1 },
          { id: 2, nombre: 'Pechuga a la plancha', tipo: 'Cena', cantidad: 1 }
        ]
      },
      {
        id: 2,
        fecha: new Date('2026-04-24'),
        estado: 'en_preparacion',
        paciente: {
          id: 2,
          nombre: 'María García',
          estado: 'activo'
        },
        recetas: [
          { id: 3, nombre: 'Salmón con verduras', tipo: 'Almuerzo', cantidad: 1 },
          { id: 4, nombre: 'Crema de calabaza', tipo: 'Cena', cantidad: 1 }
        ]
      },
      {
        id: 3,
        fecha: new Date('2026-04-23'),
        estado: 'listo',
        paciente: {
          id: 3,
          nombre: 'Carlos López',
          estado: 'inactivo'
        },
        recetas: [
          { id: 5, nombre: 'Tortilla de espinacas', tipo: 'Desayuno', cantidad: 1 }
        ]
      }
    ];
  }

  visualizarOrden(orden: OrdenProduccion): void {
    this.ordenSeleccionada = orden;
  }

  cambiarEstado(orden: OrdenProduccion, nuevoEstado: 'en_preparacion' | 'listo' | 'delivery'): void {
    const index = this.ordenes.findIndex(o => o.id === orden.id);
    if (index !== -1) {
      this.ordenes[index].estado = nuevoEstado;
      if (this.ordenSeleccionada && this.ordenSeleccionada.id === orden.id) {
        this.ordenSeleccionada = { ...this.ordenes[index] };
      }
    }
  }

  cambiarEstadoAListo(): void {
    if (this.ordenSeleccionada) {
      const index = this.ordenes.findIndex(o => o.id === this.ordenSeleccionada!.id);
      if (index !== -1) {
        this.ordenes[index].estado = 'listo';
        this.ordenSeleccionada = { ...this.ordenes[index] };
      }
    }
  }

  cerrarDetalle(): void {
    this.ordenSeleccionada = null;
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_preparacion': return 'En Preparación';
      case 'listo': return 'Listo';
      case 'delivery': return 'En Delivery';
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