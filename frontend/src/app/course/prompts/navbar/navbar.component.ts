import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-navbar',
    imports: [ButtonModule, NgOptimizedImage],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    isDark = signal(false)

    toggleDarkMode() {
        this.isDark.update(value => !value)
        document.documentElement.classList.toggle('app-dark', this.isDark())
    }

}
