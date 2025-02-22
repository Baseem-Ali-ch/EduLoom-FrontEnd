// user interface
export interface IUser {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  isActive?: boolean;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
