import { Component } from '@angular/core';
import { NgPlural } from '../../../../../node_modules/@angular/common/index';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgPlural],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
