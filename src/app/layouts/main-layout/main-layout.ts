import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importar Sidebar compartido
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { AuthService } from '../../shared/services/auth.service';

// Imports de Spartan NG
import { HlmButtonImports } from 'spartan/button';
import { HlmSeparatorImports } from 'spartan/separator';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    Sidebar,
    HlmButtonImports,
    HlmSeparatorImports,
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {
  dropdownOpen = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {

    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
