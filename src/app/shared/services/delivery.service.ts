import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Dealer {
  id: number;
  nombre: string;
  telefono: string;
  email?: string;
  licencia: string;
  vehiculo?: string;
  estado: 'activo' | 'inactivo';
}

export interface CreateDealerDto {
  identityCard: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private apiUrl = 'http://localhost:4000/api/delivery';

  constructor(private http: HttpClient) {}

  // 🔹 MAP BACKEND → FRONTEND
  private mapToDealer(data: any): Dealer {
    return {
      id: data.id,
      nombre: `${data.firstName} ${data.lastName}`,
      telefono: data.cellPhone,
      licencia: data.identityCard,
      estado: 'activo'
    };
  }

  // 🔹 MAP FRONTEND → BACKEND
  private mapToDto(dealer: Omit<Dealer, 'id'>): CreateDealerDto {
    const [firstName, ...rest] = dealer.nombre.split(' ');
    const lastName = "prueba";

    return {
      identityCard: dealer.licencia,
      firstName,
      lastName,
      cellPhone: dealer.telefono
    };
  }

  // 🔹 GET
 getDealers(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/dealers');
}

  // 🔹 CREATE
  createDealer(dealer: Omit<Dealer, 'id'>): Observable<any> {
    const payload = this.mapToDto(dealer);
    return this.http.post(`${this.apiUrl}/create-dealer`, payload);
  }

  // 🔹 UPDATE (ajústalo si tu backend lo soporta)
  updateDealer(id: number, dealer: Partial<Dealer>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dealer);
  }

  // 🔹 DELETE
  deleteDealer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
