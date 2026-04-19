import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  @Output() viewChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();
  
  collapsed = false;
  currentView = 'overview';

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  // Método para navegación por router (sin event)
  setView(view: string): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }

  // Método para links que requieren event (para prevenir default)
  onNavClick(event: Event, view: string): void {
    event.preventDefault();
    this.currentView = view;
    this.viewChange.emit(view);
  }

  logout(): void {
    this.logoutEvent.emit();
  }
}