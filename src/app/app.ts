import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrnSonnerToaster } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BrnSonnerToaster],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('nutritional-app');
}
