import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, AfterViewInit {
  currentView = 'overview';
  dropdownOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCharts();
  }

  initCharts(): void {
    // Gráfico de clientes
    const clientsCtx = document.getElementById('clientsChart') as HTMLCanvasElement;
    if (clientsCtx) {
      new Chart(clientsCtx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Nuevos Clientes',
            data: [12, 19, 15, 17, 22, 24, 18],
            borderColor: '#00E6A0',
            backgroundColor: 'rgba(0, 230, 160, 0.05)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00E6A0',
            pointBorderColor: '#0A0C10',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: { color: '#9aaec7' }
            }
          },
          scales: {
            y: { grid: { color: 'rgba(0, 255, 170, 0.05)' }, ticks: { color: '#9aaec7' } },
            x: { grid: { color: 'rgba(0, 255, 170, 0.05)' }, ticks: { color: '#9aaec7' } }
          }
        }
      });
    }

    // Gráfico de ingresos
    const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Ingresos ($)',
            data: [3200, 3800, 4100, 4500, 5200, 5800],
            backgroundColor: 'rgba(0, 180, 216, 0.5)',
            borderColor: '#00B4D8',
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: { color: '#9aaec7' }
            }
          },
          scales: {
            y: { grid: { color: 'rgba(0, 255, 170, 0.05)' }, ticks: { color: '#9aaec7' } },
            x: { grid: { color: 'rgba(0, 255, 170, 0.05)' }, ticks: { color: '#9aaec7' } }
          }
        }
      });
    }
  }

  onViewChange(view: string): void {
    this.currentView = view;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}