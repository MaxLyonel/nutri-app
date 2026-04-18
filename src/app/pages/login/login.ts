import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HlmButtonImports } from 'spartan/button';
import { HlmInputImports } from 'spartan/input';
import { HlmCardImports } from 'spartan/card';
import { HlmCheckboxImports } from 'spartan/checkbox';
import { HlmSeparatorImports } from 'spartan/separator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HlmButtonImports,
    HlmInputImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmSeparatorImports
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login data:', { email, password });
    }
  }
}
