import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonImports } from 'spartan/button';
import { HlmInputImports } from 'spartan/input';
import { HlmCardImports } from 'spartan/card';
import { HlmCheckboxImports } from 'spartan/checkbox';
import { HlmSeparatorImports } from 'spartan/separator';
import { HlmAlertImports } from 'spartan/alert';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmSeparatorImports,
    HlmAlertImports,
    NgIcon,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  showPassword: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.showError = false;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          const backendError = err.error;
          this.errorMessage = backendError?.message
            ? `${backendError.message}${backendError.error ? ' - ' + backendError.error : ''}`
            : 'Credenciales inválidas';
          this.showError = true;
        },
      });
    }
  }
}
