import { UserRole } from '../user.entity';

export class UserListDto {
  id: string;

  matricule?: string;

  first_name: string;

  last_name: string;

  email: string;

  phone?: string;

  manager_id?: string;

  department_id?: string;

  role: UserRole;

  is_active: boolean;

  created_at: Date;
}