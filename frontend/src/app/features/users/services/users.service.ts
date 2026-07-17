import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  updateRole(id: string, role: string) {
    return this.http.patch(`${this.api}/${id}/role`, {
      role,
    });
  }

  updateStatus(id: string, active: boolean) {
    return this.http.patch(`${this.api}/${id}/status`, {
      is_active: active,
    });
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}