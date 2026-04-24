import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

// Imports de Spartan NG
import { HlmCardImports } from 'spartan/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HlmCardImports
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, AfterViewInit {
  private clientsChart: Chart | undefined;
  private revenueChart: Chart | undefined;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  initCharts(): void {
    this.initClientsChart();
    this.initRevenueChart();
  }

  initClientsChart(): void {
    const canvas = document.getElementById('clientsChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.clientsChart) this.clientsChart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.clientsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Nuevos Clientes',
          data: [12, 19, 15, 17, 22, 24, 18],
          borderColor: '#00E6A0',
          backgroundColor: 'rgba(0, 230, 160, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { labels: { color: '#9aaec7' } } },
        scales: {
          y: { grid: { color: 'rgba(0, 255, 170, 0.08)' }, ticks: { color: '#9aaec7' } },
          x: { grid: { color: 'rgba(0, 255, 170, 0.08)' }, ticks: { color: '#9aaec7' } }
        }
      }
    });
  }

  initRevenueChart(): void {
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.revenueChart) this.revenueChart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Ingresos ($)',
          data: [3200, 3800, 4100, 4500, 5200, 5800],
          backgroundColor: 'rgba(0, 180, 216, 0.6)',
          borderColor: '#00B4D8',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { labels: { color: '#9aaec7' } } },
        scales: {
          y: { grid: { color: 'rgba(0, 255, 170, 0.08)' }, ticks: { color: '#9aaec7' } },
          x: { grid: { color: 'rgba(0, 255, 170, 0.08)' }, ticks: { color: '#9aaec7' } }
        }
      }
    });
  }
}