import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Collaborator } from '../models/collaborator.model';

@Injectable({ providedIn: 'root' })
export class CollaboratorsService {
  private readonly apiUrl = `${environment.apiUrl}/collaborators`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.apiUrl);
  }
}
