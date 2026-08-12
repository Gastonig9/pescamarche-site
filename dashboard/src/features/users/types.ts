export type UserRole = "admin" | "staff" | "customer";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  active?: boolean;
  phone?: string;
}

export type UpdateUserInput = Partial<Omit<CreateUserInput, "password">>;
