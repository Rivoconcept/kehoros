export interface User {
  id: string;

  matricule: string;

  first_name: string;

  last_name: string;

  email: string;

  role: 'admin' | 'manager' | 'user';

  is_active: boolean;

  two_factor_enabled: boolean;

  created_at: string;

  manager?: {
    id: string;
    first_name: string;
    last_name: string;
  };

  department?: {
    id: string;
    name: string;
  };
}