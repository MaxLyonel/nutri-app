import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Imports de Spartan NG
import { HlmSidebarImports } from 'spartan/sidebar';
import { HlmButtonImports } from 'spartan/button';
import { HlmSeparatorImports } from 'spartan/separator';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HlmSidebarImports,
    HlmButtonImports,
    HlmSeparatorImports
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  @Output() viewChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();
  
  collapsed = false;
  activeView = 'overview'; // 👈 Agregar esta propiedad

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  setView(view: string): void {
    this.activeView = view; // 👈 Actualizar activeView
    this.viewChange.emit(view);
  }

  onNavClick(event: Event, view: string): void {
    event.preventDefault();
    this.activeView = view; // 👈 Actualizar activeView
    this.viewChange.emit(view);
  }

  logout(): void {
    this.logoutEvent.emit();
  }
}