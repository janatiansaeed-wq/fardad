export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "PHOTOGRAPHER"
  | "CUSTOMER";

export interface User {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  role: UserRole;

  avatar?: string;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}