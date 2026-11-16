import { Component } from '@angular/core';
import { NavbarCollaboratorsComponent } from '../navbar-collaborators/navbar-collaborators.component';

@Component({
  imports: [NavbarCollaboratorsComponent],
  selector: 'app-collaborators-list',
  styleUrl: './collaborators-list.component.scss',
  templateUrl: './collaborators-list.component.html',
})
export class CollaboratorsListComponent {
}
