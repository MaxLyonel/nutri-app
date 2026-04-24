import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from 'spartan/button';
import { HlmInputImports } from 'spartan/input';
import { HlmCardImports } from 'spartan/card';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasPlan?: boolean;
  planName?: string;
}

@Component({
  selector: 'app-plan-creator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmCardImports,
  ],
  templateUrl: './plan-creator.html',
  styleUrls: ['./plan-creator.scss']
})
export class PlanCreator implements OnInit {
  // Datos del plan
  planName = '';
  planDetail = '';

  // Calendario
  currentDate = new Date();
  flattenedCalendarDays: CalendarDay[] = []; // Array plano de 42 días
  selectedDay: CalendarDay | null = null;
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Formulario de asignación
  selectedTime = '';
  selectedRecipe = '';
  showRecipeSelector = false;

  // Formulario de catering
  cateringAddress = '';
  deliveryTime = '';
  deliveryDetail = '';

  recipes = [
    'Ensalada de quinoa',
    'Pechuga a la plancha',
    'Salmón con verduras',
    'Crema de calabaza',
    'Tortilla de espinacas'
  ];

  ngOnInit(): void {
    this.generateCalendar();
  }

  getMonthYear(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  formatDate(date: Date): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Ajustar para que la semana empiece en lunes (0 = domingo)
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Días del mes anterior
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const allDays: CalendarDay[] = [];

    // Agregar días del mes anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      allDays.push({ date, isCurrentMonth: false });
    }

    // Agregar días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      allDays.push({ date, isCurrentMonth: true });
    }

    // Agregar días del mes siguiente para completar 42 días (6 semanas)
    const remainingDays = 42 - allDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      allDays.push({ date, isCurrentMonth: false });
    }

    this.flattenedCalendarDays = allDays;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.selectedDay = null;
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.selectedDay = null;
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
    this.selectedTime = '';
    this.selectedRecipe = '';
    this.showRecipeSelector = false;
  }

  addTime(): void {
    console.log('Agregar tiempo');
  }

  toggleRecipeSelector(): void {
    this.showRecipeSelector = !this.showRecipeSelector;
  }

  selectRecipe(recipe: string): void {
    this.selectedRecipe = recipe;
    this.showRecipeSelector = false;
  }

  addToPlan(): void {
    if (this.selectedDay && this.selectedRecipe) {
      this.selectedDay.hasPlan = true;
      this.selectedDay.planName = `${this.selectedRecipe}`;
      alert(`Plan asignado para el ${this.formatDate(this.selectedDay.date)}`);
      this.selectedDay = null;
    } else {
      alert('Selecciona una receta');
    }
  }

  registerPlan(): void {
    console.log('Registrar plan:', {
      planName: this.planName,
      planDetail: this.planDetail,
      catering: {
        address: this.cateringAddress,
        deliveryTime: this.deliveryTime,
        deliveryDetail: this.deliveryDetail
      }
    });
    alert('Plan registrado correctamente');
  }
}