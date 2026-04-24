import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth-interceptor';

// Configuración de íconos si usas @ng-icons
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideUser, lucideSettings, lucideLogOut } from '@ng-icons/lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideAnimations(),
    provideIcons({
      lucideArrowUp,
      lucideUser,
      lucideSettings,
      lucideLogOut
    })
  ],
};
