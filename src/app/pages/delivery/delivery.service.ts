import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Dealer {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  licencia: string;
  vehiculo: string;
  estado: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private dealers: Dealer[] = [
    { id: 1, nombre: 'Juan Pérez', telefono: '555-0101', email: 'juan@nutre.com', licencia: 'CD-123456', vehiculo: 'Motocicleta', estado: 'activo' },
    { id: 2, nombre: 'María López', telefono: '555-0102', email: 'maria@nutre.com', licencia: 'CD-234567', vehiculo: 'Bicicleta', estado: 'activo' },
    { id: 3, nombre: 'Carlos García', telefono: '555-0103', email: 'carlos@nutre.com', licencia: 'CD-345678', vehiculo: 'Motocicleta', estado: 'inactivo' },
  ];

  private dealersSubject = new BehaviorSubject<Dealer[]>(this.dealers);
  dealers$ = this.dealersSubject.asObservable();

  getDealers(): Dealer[] {
    return this.dealers;
  }

  getDealerById(id: number): Dealer | undefined {
    return this.dealers.find(d => d.id === id);
  }

  createDealer(dealer: Omit<Dealer, 'id'>): Dealer {
    const newId = Math.max(...this.dealers.map(d => d.id), 0) + 1;
    const newDealer: Dealer = { ...dealer, id: newId };
    this.dealers.push(newDealer);
    this.dealersSubject.next([...this.dealers]);
    return newDealer;
  }

  updateDealer(id: number, dealer: Partial<Dealer>): Dealer | undefined {
    const index = this.dealers.findIndex(d => d.id === id);
    if (index !== -1) {
      this.dealers[index] = { ...this.dealers[index], ...dealer };
      this.dealersSubject.next([...this.dealers]);
      return this.dealers[index];
    }
    return undefined;
  }

  deleteDealer(id: number): boolean {
    const initialLength = this.dealers.length;
    this.dealers = this.dealers.filter(d => d.id !== id);
    if (this.dealers.length !== initialLength) {
      this.dealersSubject.next([...this.dealers]);
      return true;
    }
    return false;
  }
}