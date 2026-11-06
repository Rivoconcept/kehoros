import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const defaultPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}',
    }
  }
});

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync(),
    providePrimeNG({
      theme: { 
        preset: defaultPreset,
        options: {
          darkModeSelector: '.app-dark'
        }
       },
      license: 'eyJpZCI6IjIzNGY1MTYyLWRjMDAtNDBjZi1hNGFmLWJlMjA1MWFiNzNkOCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTMxNzI4MDMsImV4cCI6MTgyNDcwODgwM30.XBBZFafXQAyeVOYyXLMWjr_Ddp9pongpxq1fJ_8e71-UEGfUo5RJd7OgAhYQyng9kLtyFJ4gLuUMpFOiMZF6Dg',
    }),
  ],
}).catch(err => console.error(err));