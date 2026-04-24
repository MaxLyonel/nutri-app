import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Imports de Spartan NG
import { HlmButtonImports } from 'spartan/button';
import { HlmInputImports } from 'spartan/input';
import { HlmCardImports } from 'spartan/card';

interface Client {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  plan: string;
  lastActivity: string;
  avatarColor: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmCardImports,
  ],
  templateUrl: './clients.html',
  styleUrls: ['./clients.scss']
})
export class Clients implements OnInit {
  // Estado de UI
  dropdownOpen = false;
  columnMenuOpen = false;
  searchTerm = '';
  showRegisterPanel = false;
  
  // ID de la fila recién registrada (para el efecto de parpadeo)
  highlightRowId: number | null = null;
  
  // Guardar el estado original de las columnas
  private originalColumnVisibility = {
    name: true,
    email: true,
    status: true,
    plan: true,
    lastActivity: true,
  };

  // Visibilidad de columnas
  columnVisibility = {
    name: true,
    email: true,
    status: true,
    plan: true,
    lastActivity: true,
  };

  // Columnas que se ocultarán al abrir el panel
  private columnsToHide = ['status', 'plan'];

  // Opciones de columnas para el menú
  columnOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Estado' },
    { key: 'plan', label: 'Plan' },
    { key: 'lastActivity', label: 'Última Actividad' },
  ];

  // Formulario de nuevo cliente
  newClient = {
    name: '',
    email: '',
    status: 'active' as const,
    plan: 'Básico',
    avatarColor: '#00E6A0'
  };

  // Opciones para selects
  planOptions = ['Básico', 'Premium', 'Profesional'];
  statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'inactive', label: 'Inactivo' }
  ];
  colorOptions = [
    { value: '#00E6A0', label: 'Verde' },
    { value: '#00B4D8', label: 'Azul' },
    { value: '#ff6b35', label: 'Naranja' },
    { value: '#9c27b0', label: 'Morado' },
    { value: '#e74c3c', label: 'Rojo' }
  ];

  // Datos de clientes
  private allData: Client[] = [
    { id: 1, name: 'María González', email: 'maria@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 2 horas', avatarColor: '#00E6A0' },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 5 horas', avatarColor: '#00B4D8' },
    { id: 3, name: 'Laura Fernández', email: 'laura@nutre.com', status: 'pending', plan: 'Premium', lastActivity: 'Hace 1 día', avatarColor: '#ff6b35' },
    { id: 4, name: 'Ana Martínez', email: 'ana@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 3 horas', avatarColor: '#9c27b0' },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@nutre.com', status: 'inactive', plan: 'Básico', lastActivity: 'Hace 2 semanas', avatarColor: '#e74c3c' },
    { id: 6, name: 'Sofía López', email: 'sofia@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 1 hora', avatarColor: '#00E6A0' },
    { id: 7, name: 'Javier Ruiz', email: 'javier@nutre.com', status: 'pending', plan: 'Profesional', lastActivity: 'Hace 3 días', avatarColor: '#ff6b35' },
    { id: 8, name: 'Elena Torres', email: 'elena@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 4 horas', avatarColor: '#00B4D8' },
    { id: 9, name: 'Diego Ramírez', email: 'diego@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 6 horas', avatarColor: '#00E6A0' },
    { id: 10, name: 'Carmen Vega', email: 'carmen@nutre.com', status: 'inactive', plan: 'Profesional', lastActivity: 'Hace 1 mes', avatarColor: '#e74c3c' },
    { id: 11, name: 'Roberto Castro', email: 'roberto@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 30 minutos', avatarColor: '#9c27b0' },
    { id: 12, name: 'Patricia Díaz', email: 'patricia@nutre.com', status: 'pending', plan: 'Básico', lastActivity: 'Hace 2 días', avatarColor: '#ff6b35' },
    { id: 13, name: 'Fernando Gil', email: 'fernando@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 12 horas', avatarColor: '#00B4D8' },
    { id: 14, name: 'Isabel Méndez', email: 'isabel@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 45 minutos', avatarColor: '#00E6A0' },
    { id: 15, name: 'Ricardo Peña', email: 'ricardo@nutre.com', status: 'inactive', plan: 'Básico', lastActivity: 'Hace 3 semanas', avatarColor: '#e74c3c' },
    { id: 16, name: 'Natalia Ortiz', email: 'natalia@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 1 hora', avatarColor: '#9c27b0' },
    { id: 17, name: 'Alberto Flores', email: 'alberto@nutre.com', status: 'pending', plan: 'Premium', lastActivity: 'Hace 4 días', avatarColor: '#ff6b35' },
    { id: 18, name: 'Verónica Soto', email: 'veronica@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 8 horas', avatarColor: '#00B4D8' },
    { id: 19, name: 'Manuel Ríos', email: 'manuel@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 2 horas', avatarColor: '#00E6A0' },
    { id: 20, name: 'Adriana Mora', email: 'adriana@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 20 minutos', avatarColor: '#9c27b0' },
  ];

  currentData: Client[] = [];
  filteredData: Client[] = [];
  selectedRows = new Set<number>();
  
  // Paginación
  currentPage = 1;
  pageSize = 10;
  sortColumn: keyof Client | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cdr: ChangeDetectorRef) {
    this.currentData = [...this.allData];
    this.filteredData = [...this.allData];
  }

  ngOnInit(): void {
    this.filterData();
  }

  // ============================================
  // MÉTODOS DEL PANEL DE REGISTRO (TOGGLE)
  // ============================================
  toggleRegisterPanel(): void {
    if (this.showRegisterPanel) {
      this.closeRegisterPanel();
    } else {
      this.openRegisterPanel();
    }
  }

  openRegisterPanel(): void {
    this.originalColumnVisibility = { ...this.columnVisibility };
    
    for (const col of this.columnsToHide) {
      if (this.columnVisibility[col as keyof typeof this.columnVisibility]) {
        this.columnVisibility[col as keyof typeof this.columnVisibility] = false;
      }
    }
    
    this.showRegisterPanel = true;
  }

  closeRegisterPanel(): void {
    this.columnVisibility = { ...this.originalColumnVisibility };
    this.showRegisterPanel = false;
    this.resetForm();
    this.cdr.detectChanges();
  }

  resetForm(): void {
    this.newClient = {
      name: '',
      email: '',
      status: 'active',
      plan: 'Básico',
      avatarColor: '#00E6A0'
    };
  }

  // ============================================
  // REGISTRO DE CLIENTE CON EFECTO DE PARPADEO
  // ============================================
// En el método registerClient(), actualizar el setTimeout a 4000ms
registerClient(): void {
  if (!this.newClient.name || !this.newClient.email) {
    alert('Por favor completa los campos obligatorios');
    return;
  }

  // Generar nuevo ID
  const newId = Math.max(...this.currentData.map(c => c.id)) + 1;
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeStr = `Hace ${hours}:${minutes.toString().padStart(2, '0')}`;
  
  const newClientData: Client = {
    id: newId,
    name: this.newClient.name,
    email: this.newClient.email,
    status: this.newClient.status,
    plan: this.newClient.plan,
    lastActivity: timeStr,
    avatarColor: this.newClient.avatarColor
  };

  // Agregar al inicio del array
  this.currentData.unshift(newClientData);
  
  // Resetear filtros y paginación
  this.searchTerm = '';
  this.filterData();
  this.currentPage = 1;
  
  // Guardar el ID del nuevo cliente para resaltarlo
  this.highlightRowId = newId;
  
  // Limpiar el resaltado después de 4 segundos (más tiempo)
  setTimeout(() => {
    this.highlightRowId = null;
    this.cdr.detectChanges();
  }, 3500); // Aumentado de 3000 a 4000ms
  
  // Cerrar el panel y mostrar mensaje
  this.closeRegisterPanel();
  alert(`✅ Cliente "${newClientData.name}" registrado correctamente`);
}
  // ============================================
  // MÉTODOS DE FILTRADO Y ORDENAMIENTO
  // ============================================
  filterData(): void {
    if (!this.searchTerm) {
      this.filteredData = [...this.currentData];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.currentData.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
      );
    }
    this.sortData();
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  sortData(): void {
    if (!this.sortColumn) return;
    
    this.filteredData.sort((a, b) => {
      let valA = a[this.sortColumn!] as string;
      let valB = b[this.sortColumn!] as string;
      
      valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
      valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
      
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onFilterChange(value: string): void {
    this.searchTerm = value;
    this.filterData();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterData();
  }

  sort(column: keyof Client): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  // ============================================
  // MÉTODOS DE PAGINACIÓN
  // ============================================
  get paginatedData(): Client[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.filteredData.length);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value);
    this.currentPage = 1;
  }

  // ============================================
  // MÉTODOS DE SELECCIÓN
  // ============================================
  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.paginatedData.forEach(item => this.selectedRows.add(item.id));
    } else {
      this.paginatedData.forEach(item => this.selectedRows.delete(item.id));
    }
  }

  toggleSelect(client: Client): void {
    if (this.selectedRows.has(client.id)) {
      this.selectedRows.delete(client.id);
    } else {
      this.selectedRows.add(client.id);
    }
  }

  isSelected(client: Client): boolean {
    return this.selectedRows.has(client.id);
  }

  isAllSelected(): boolean {
    return this.paginatedData.length > 0 && 
           this.paginatedData.every(item => this.selectedRows.has(item.id));
  }

  isSomeSelected(): boolean {
    return this.paginatedData.some(item => this.selectedRows.has(item.id)) && 
           !this.isAllSelected();
  }

  deleteSelected(): void {
    if (confirm(`¿Eliminar ${this.selectedRows.size} cliente(s)?`)) {
      this.currentData = this.currentData.filter(item => !this.selectedRows.has(item.id));
      this.filteredData = this.filteredData.filter(item => !this.selectedRows.has(item.id));
      this.selectedRows.clear();
      this.filterData();
    }
  }

  deleteClient(id: number): void {
    if (confirm('¿Eliminar este cliente?')) {
      this.currentData = this.currentData.filter(item => item.id !== id);
      this.filteredData = this.filteredData.filter(item => item.id !== id);
      this.selectedRows.delete(id);
      this.filterData();
    }
  }

  editClient(id: number): void {
    alert(`Editar cliente ID: ${id}`);
  }

  // ============================================
  // MÉTODOS DE COLUMNAS
  // ============================================
  toggleColumn(columnKey: string): void {
    this.columnVisibility = {
      ...this.columnVisibility,
      [columnKey]: !this.columnVisibility[columnKey as keyof typeof this.columnVisibility]
    };
    this.cdr.detectChanges();
  }

  isColumnVisible(columnKey: string): boolean {
    return this.columnVisibility[columnKey as keyof typeof this.columnVisibility];
  }

  get visibleColumnCount(): number {
    return Object.values(this.columnVisibility).filter(v => v).length;
  }

  toggleColumnMenu(): void {
    this.columnMenuOpen = !this.columnMenuOpen;
  }

  // Método para saber si una fila debe tener el efecto de resaltado
  isHighlighted(clientId: number): boolean {
    return this.highlightRowId === clientId;
  }

  // ============================================
  // MÉTODOS DE UI
  // ============================================
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  }
}