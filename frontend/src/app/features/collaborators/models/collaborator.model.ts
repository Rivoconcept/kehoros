export interface Collaborator {
  id: string;
  matricule: string;
  nom: string;
  prenoms: string | null;
  email: string;
  fonction: string | null;
  niveau: string | null;
  pole: string | null;
  departement: string | null;
  manager: string | null;
  supervisor: string | null;
  pays: string | null;
  equipeFr: string | null;
  verticale: string | null;
  accesDrive: boolean;
  abilityDelegation: boolean;
  delegatedMail: string | null;
  noticed: string | null;
  createdAt: string;
  updatedAt: string;
}
