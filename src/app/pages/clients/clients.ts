import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from 'spartan/button';
import { HlmInputImports } from 'spartan/input';
import { HlmCardImports } from 'spartan/card';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../shared/services/auth.service';

interface Client {
  id: number;
  patientId: string;
  name: string;
  fullName: string;
  lastName: string;
  gender: string;
  identityCard: string;
  cellPhone: string;
  email: string;
  weight: number;
  height: number;
  bodyComposition: string;
  objective: string;
  status: 'active' | 'pending' | 'inactive';
  plan: string;
}

// Interfaz para la respuesta del API
interface ApiResponse {
  status: string;
  message: string;
  data?: any;
  statusCode?: number;
  error?: string;
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
    ConfirmDialogComponent,
  ],
  templateUrl: './clients.html',
  styleUrls: ['./clients.scss'],
})
export class Clients implements OnInit {
  // Estado de UI
  dropdownOpen = false;
  columnMenuOpen = false;
  searchTerm = '';
  showRegisterPanel = false;
  showDeleteDialog = false;
  clientToDelete: Client | null = null;
  isEditing = false;
  editingClient: Client | null = null;
  isLoading = false; // Para mostrar loading durante el registro

  // ID de la fila recién registrada (para el efecto de parpadeo)
  highlightRowId: number | null = null;

  // Guardar el estado original de las columnas
  private originalColumnVisibility = {
    name: true,
    gender: true,
    identityCard: true,
    cellPhone: true,
    weight: true,
    height: true,
    bodyComposition: true,
    objective: true,
  };

  columnVisibility = {
    name: true,
    gender: true,
    identityCard: true,
    cellPhone: true,
    weight: true,
    height: true,
    bodyComposition: true,
    objective: true,
  };

  // Columnas que se ocultarán al abrir el panel
  private columnsToHide = ['gender', 'cellPhone'];

  columnOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'gender', label: 'Género' },
    { key: 'identityCard', label: 'Carnet' },
    { key: 'cellPhone', label: 'Celular' },
    { key: 'weight', label: 'Peso' },
    { key: 'height', label: 'Altura' },
    { key: 'bodyComposition', label: 'Composición' },
    { key: 'objective', label: 'Objetivo' },
  ];

  // Opciones para selects del formulario ACTUALIZADO
  genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' },
  ];

  objectiveOptions = [
    { value: 'bajarPeso', label: 'Bajar de peso' },
    { value: 'subirPeso', label: 'Subir de peso' },
    { value: 'mantenerPeso', label: 'Mantener peso' },
    { value: 'ganarMusculo', label: 'Ganar masa muscular' },
    { value: 'definicion', label: 'Definición corporal' },
  ];

  bodyCompositionOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Sobrepeso', label: 'Sobrepeso' },
    { value: 'Obesidad', label: 'Obesidad' },
    { value: 'Bajo peso', label: 'Bajo peso' },
    { value: 'Musculoso', label: 'Musculoso' },
  ];

  // Opciones para selects (mantener las existentes)
  planOptions = ['Básico', 'Premium', 'Profesional'];
  statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'inactive', label: 'Inactivo' },
  ];
  colorOptions = [
    { value: '#00E6A0', label: 'Verde' },
    { value: '#00B4D8', label: 'Azul' },
    { value: '#ff6b35', label: 'Naranja' },
    { value: '#9c27b0', label: 'Morado' },
    { value: '#e74c3c', label: 'Rojo' },
  ];

  private readonly API_URL = 'http://localhost:4000/api/advice';
  private readonly AUTH_URL = 'http://localhost:4000/api/auth/login';

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
  }

  // Formulario de nuevo cliente
  newClient = {
    fullName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F' | 'O',
    identityCard: '',
    cellPhone: '',
    location: {
      latitude: -16.5,
      longitude: -68.15,
    },
    weight: 70,
    height: 1.7,
    bodyComposition: 'Normal',
    objective: 'bajarPeso',
  };

  private readonly allData: Client[] = [];

  currentData: Client[] = [];
  filteredData: Client[] = [];
  selectedRows = new Set<number>();

  // Paginación
  currentPage = 1;
  pageSize = 10;
  sortColumn: keyof Client | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.loadPatients();
  }

  async loadPatients(): Promise<void> {
    try {
      console.log('Cargando pacientes desde API...');
      const response = await this.http
        .get<any>(`${this.API_URL}/all-patients`, { headers: this.getHeaders() })
        .toPromise();

      if (response?.data && Array.isArray(response.data)) {
        this.currentData = response.data.map((patient: any, index: number) => ({
          id: index + 1,
          patientId: patient.id,
          name: `${patient.fullName || ''} ${patient.lastName || ''}`.trim(),
          fullName: patient.fullName,
          lastName: patient.lastName,
          gender: patient.gender?.value,
          identityCard: patient.identityCard?.number,
          cellPhone: patient.cellPhone?.number,
          email: patient.email || '',
          weight: patient.diagnosis?.weight?.value,
          height: patient.diagnosis?.height?.value,
          bodyComposition: patient.diagnosis?.bodyComposition?.value,
          objective: patient.diagnosis?.objective,
          status: 'active',
          plan: 'Básico',
        }));
        this.filteredData = [...this.currentData];
        console.log('Pacientes cargados:', this.currentData.length);
        this.cdr.detectChanges();
      } else {
        console.warn('No hay datos en la respuesta');
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'Hace poco';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hace poco';
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
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
    this.isEditing = false;
    this.editingClient = null;
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
        longitude: -68.15,
      },
      weight: 70,
      height: 1.7,
      bodyComposition: 'Normal',
      objective: 'bajarPeso',
    };
  }

  // ============================================
  // REGISTRO DE CLIENTE CON EL ENDPOINT
  // ============================================
  async registerClient(): Promise<void> {
    // Validar campos obligatorios según el endpoint
    if (!this.newClient.fullName || !this.newClient.lastName || !this.newClient.identityCard) {
      toast.error('Por favor completa los campos obligatorios');
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
        longitude: this.newClient.location.longitude,
      },
      weight: this.newClient.weight,
      height: this.newClient.height,
      bodyComposition: this.newClient.bodyComposition,
      objective: this.newClient.objective,
    };

    try {
      const response = await this.http
        .post<ApiResponse>(`${this.API_URL}/create-patient`, payload, {
          headers: this.getHeaders(),
        })
        .toPromise();

      if (response?.status === 'success') {
        const newId = Math.max(...this.currentData.map((c) => c.id), 0) + 1;

        const newClientData: Client = {
          id: newId,
          patientId: '',
          name: `${this.newClient.fullName} ${this.newClient.lastName}`,
          fullName: this.newClient.fullName,
          lastName: this.newClient.lastName,
          gender: this.newClient.gender,
          identityCard: this.newClient.identityCard,
          cellPhone: this.newClient.cellPhone,
          email: '',
          weight: this.newClient.weight,
          height: this.newClient.height,
          bodyComposition: this.newClient.bodyComposition,
          objective: this.newClient.objective,
          status: 'active',
          plan: 'Básico',
        };

        // Agregar al inicio del array
        this.currentData.unshift(newClientData);

        // Cerrar el panel
        this.closeRegisterPanel();

        // Recargar la lista desde la API
        await this.loadPatients();

        // Mostrar mensaje de éxito
        toast.success(`Paciente "${newClientData.name}" registrado correctamente`);
      } else {
        toast.error(response?.message || 'No se pudo registrar el paciente');
      }
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      toast.error('Error de conexión. Verifica tu conexión al servidor.');
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
      this.filteredData = this.currentData.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.identityCard?.toLowerCase().includes(term) ||
          item.cellPhone?.includes(term) ||
          item.objective?.toLowerCase().includes(term),
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
      this.paginatedData.forEach((item) => this.selectedRows.add(item.id));
    } else {
      this.paginatedData.forEach((item) => this.selectedRows.delete(item.id));
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
    return (
      this.paginatedData.length > 0 &&
      this.paginatedData.every((item) => this.selectedRows.has(item.id))
    );
  }

  isSomeSelected(): boolean {
    return (
      this.paginatedData.some((item) => this.selectedRows.has(item.id)) && !this.isAllSelected()
    );
  }

  deleteSelected(): void {
    if (confirm(`¿Eliminar ${this.selectedRows.size} cliente(s)?`)) {
      this.currentData = this.currentData.filter((item) => !this.selectedRows.has(item.id));
      this.filteredData = this.filteredData.filter((item) => !this.selectedRows.has(item.id));
      this.selectedRows.clear();
      this.filterData();
    }
  }

  deleteClient(client: Client): void {
    if (!client.patientId) {
      toast.error('No se puede eliminar: falta el ID del paciente');
      return;
    }
    this.clientToDelete = client;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.clientToDelete?.patientId) {
      this.deletePatientByApi(this.clientToDelete.patientId);
    }
    this.showDeleteDialog = false;
    this.clientToDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.clientToDelete = null;
  }

  async deletePatientByApi(patientId: string): Promise<void> {
    try {
      const response = await this.http
        .delete<any>(`${this.API_URL}/patient/${patientId}`, {
          headers: this.getHeaders(),
        })
        .toPromise();

      if (response?.status === 'success') {
        toast.success('Paciente eliminado correctamente');
        await this.loadPatients();
      } else {
        toast.error(response?.message || 'No se pudo eliminar el paciente');
      }
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      toast.error('Error de conexión');
    }
  }

  editClient(client: Client): void {
    this.editingClient = client;
    this.isEditing = true;
    this.newClient = {
      fullName: client.fullName,
      lastName: client.lastName,
      gender: client.gender as 'M' | 'F' | 'O',
      identityCard: client.identityCard,
      cellPhone: client.cellPhone,
      location: { latitude: -16.5, longitude: -68.15 },
      weight: client.weight,
      height: client.height,
      bodyComposition: client.bodyComposition,
      objective: client.objective,
    };
    this.showRegisterPanel = true;
  }

  async updateClient(): Promise<void> {
    if (!this.editingClient?.patientId) {
      toast.error('No se puede actualizar: falta el ID del paciente');
      return;
    }

    if (!this.newClient.fullName || !this.newClient.lastName || !this.newClient.identityCard) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    this.isLoading = true;

    const payload = {
      fullName: this.newClient.fullName,
      lastName: this.newClient.lastName,
      gender: this.newClient.gender,
      identityCard: this.newClient.identityCard,
      cellPhone: this.newClient.cellPhone,
      location: this.newClient.location,
      weight: this.newClient.weight,
      height: this.newClient.height,
      bodyComposition: this.newClient.bodyComposition,
      objective: this.newClient.objective,
    };

    try {
      const response = await this.http
        .put<ApiResponse>(`${this.API_URL}/patient/${this.editingClient.patientId}`, payload, {
          headers: this.getHeaders(),
        })
        .toPromise();

      if (response?.status === 'success') {
        toast.success('Paciente actualizado correctamente');
        this.closeRegisterPanel();
        await this.loadPatients();
      } else {
        toast.error(response?.message || 'No se pudo actualizar el paciente');
      }
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      toast.error('Error de conexión');
    } finally {
      this.isLoading = false;
    }
  }

  // ============================================
  // MÉTODOS DE COLUMNAS
  // ============================================
  toggleColumn(columnKey: string): void {
    this.columnVisibility = {
      ...this.columnVisibility,
      [columnKey]: !this.columnVisibility[columnKey as keyof typeof this.columnVisibility],
    };
    this.cdr.detectChanges();
  }

  isColumnVisible(columnKey: string): boolean {
    return this.columnVisibility[columnKey as keyof typeof this.columnVisibility];
  }

  get visibleColumnCount(): number {
    return Object.values(this.columnVisibility).filter((v) => v).length;
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
