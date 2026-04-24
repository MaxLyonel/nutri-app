import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
}

// Interfaz para la respuesta del API
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
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
  isLoading = false; // Para mostrar loading durante el registro
  
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

  // Opciones para selects del formulario ACTUALIZADO
  genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];
  
  objectiveOptions = [
    { value: 'bajarPeso', label: 'Bajar de peso' },
    { value: 'subirPeso', label: 'Subir de peso' },
    { value: 'mantenerPeso', label: 'Mantener peso' },
    { value: 'ganarMusculo', label: 'Ganar masa muscular' },
    { value: 'definicion', label: 'Definición corporal' }
  ];
  
  bodyCompositionOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Sobrepeso', label: 'Sobrepeso' },
    { value: 'Obesidad', label: 'Obesidad' },
    { value: 'Bajo peso', label: 'Bajo peso' },
    { value: 'Musculoso', label: 'Musculoso' }
  ];

  // Opciones para selects (mantener las existentes)
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

  // Formulario de nuevo cliente - ACTUALIZADO según el endpoint
  newClient = {
    // Campos para el endpoint
    fullName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F' | 'O',
    identityCard: '',
    cellPhone: '',
    location: {
      latitude: -16.5,
      longitude: -68.15
    },
    weight: 70,
    height: 1.70,
    bodyComposition: 'Normal',
    objective: 'bajarPeso',
    // Campos adicionales para la tabla (no se envían al backend)
    email: '',
    status: 'active' as const,
    plan: 'Básico'
  };
  

  // Datos de clientes
  private allData: Client[] = [
    { id: 1, name: 'María González', email: 'maria@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 2 horas',  },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 5 horas',  },
    { id: 3, name: 'Laura Fernández', email: 'laura@nutre.com', status: 'pending', plan: 'Premium', lastActivity: 'Hace 1 día',  },
    { id: 4, name: 'Ana Martínez', email: 'ana@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 3 horas',  },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@nutre.com', status: 'inactive', plan: 'Básico', lastActivity: 'Hace 2 semanas',  },
    { id: 6, name: 'Sofía López', email: 'sofia@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 1 hora',  },
    { id: 7, name: 'Javier Ruiz', email: 'javier@nutre.com', status: 'pending', plan: 'Profesional', lastActivity: 'Hace 3 días',  },
    { id: 8, name: 'Elena Torres', email: 'elena@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 4 horas',  },
    { id: 9, name: 'Diego Ramírez', email: 'diego@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 6 horas',  },
    { id: 10, name: 'Carmen Vega', email: 'carmen@nutre.com', status: 'inactive', plan: 'Profesional', lastActivity: 'Hace 1 mes',  },
    { id: 11, name: 'Roberto Castro', email: 'roberto@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 30 minutos',  },
    { id: 12, name: 'Patricia Díaz', email: 'patricia@nutre.com', status: 'pending', plan: 'Básico', lastActivity: 'Hace 2 días',  },
    { id: 13, name: 'Fernando Gil', email: 'fernando@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 12 horas',  },
    { id: 14, name: 'Isabel Méndez', email: 'isabel@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 45 minutos',  },
    { id: 15, name: 'Ricardo Peña', email: 'ricardo@nutre.com', status: 'inactive', plan: 'Básico', lastActivity: 'Hace 3 semanas',  },
    { id: 16, name: 'Natalia Ortiz', email: 'natalia@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 1 hora',  },
    { id: 17, name: 'Alberto Flores', email: 'alberto@nutre.com', status: 'pending', plan: 'Premium', lastActivity: 'Hace 4 días',  },
    { id: 18, name: 'Verónica Soto', email: 'veronica@nutre.com', status: 'active', plan: 'Básico', lastActivity: 'Hace 8 horas',  },
    { id: 19, name: 'Manuel Ríos', email: 'manuel@nutre.com', status: 'active', plan: 'Profesional', lastActivity: 'Hace 2 horas',  },
    { id: 20, name: 'Adriana Mora', email: 'adriana@nutre.com', status: 'active', plan: 'Premium', lastActivity: 'Hace 20 minutos',  },
  ];

  currentData: Client[] = [];
  filteredData: Client[] = [];
  selectedRows = new Set<number>();
  
  // Paginación
  currentPage = 1;
  pageSize = 10;
  sortColumn: keyof Client | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient  // 👈 Agregar HttpClient
  ) {
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
      fullName: '',
      lastName: '',
      gender: 'M',
      identityCard: '',
      cellPhone: '',
      location: {
        latitude: -16.5,
        longitude: -68.15
      },
      weight: 70,
      height: 1.70,
      bodyComposition: 'Normal',
      objective: 'bajarPeso',
      email: '',
      status: 'active',
      plan: 'Básico'
    };
  }

  // ============================================
  // REGISTRO DE CLIENTE CON EL ENDPOINT
  // ============================================
  async registerClient(): Promise<void> {
    // Validar campos obligatorios según el endpoint
    if (!this.newClient.fullName || !this.newClient.lastName || !this.newClient.identityCard) {
      alert('Por favor completa los campos obligatorios: Nombre, Apellido y Carnet de identidad');
      return;
    }

    this.isLoading = true;

    // Construir el payload según el endpoint
    const payload = {
      fullName: this.newClient.fullName,
      lastName: this.newClient.lastName,
      gender: this.newClient.gender,
      identityCard: this.newClient.identityCard,
      cellPhone: this.newClient.cellPhone,
      location: {
        latitude: this.newClient.location.latitude,
        longitude: this.newClient.location.longitude
      },
      weight: this.newClient.weight,
      height: this.newClient.height,
      bodyComposition: this.newClient.bodyComposition,
      objective: this.newClient.objective
    };

    try {
      const response = await this.http.post<ApiResponse>(
        'http://localhost:4000/api/advice/create-patient',
        payload
      ).toPromise();

      if (response?.success) {
        // Generar nuevo ID para la tabla local
        const newId = Math.max(...this.currentData.map(c => c.id), 0) + 1;
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `Hace ${hours}:${minutes.toString().padStart(2, '0')}`;
        
        // Crear objeto para la tabla local
        const newClientData: Client = {
          id: newId,
          name: `${this.newClient.fullName} ${this.newClient.lastName}`,
          email: this.newClient.email || `${this.newClient.fullName.toLowerCase()}@paciente.com`,
          status: this.newClient.status,
          plan: this.newClient.plan,
          lastActivity: timeStr,
        };

        // Agregar al inicio del array
        this.currentData.unshift(newClientData);
        
        // Resetear filtros y paginación
        this.searchTerm = '';
        this.filterData();
        this.currentPage = 1;
        
        // Guardar el ID del nuevo cliente para resaltarlo
        this.highlightRowId = newId;
        
        // Limpiar el resaltado después de 3.5 segundos
        setTimeout(() => {
          this.highlightRowId = null;
          this.cdr.detectChanges();
        }, 3500);
        
        // Cerrar el panel y mostrar mensaje de éxito
        this.closeRegisterPanel();
        alert(`✅ Paciente "${newClientData.name}" registrado correctamente`);
      } else {
        alert(`❌ Error: ${response?.message || 'No se pudo registrar el paciente'}`);
      }
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      alert('❌ Error de conexión. Verifica tu conexión al servidor.');
    } finally {
      this.isLoading = false;
    }
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