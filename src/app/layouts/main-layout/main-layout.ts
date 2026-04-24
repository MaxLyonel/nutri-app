import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importar Sidebar compartido
import { Sidebar } from '../../shared/components/sidebar/sidebar';

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
    HlmSeparatorImports
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout {
  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  }
}