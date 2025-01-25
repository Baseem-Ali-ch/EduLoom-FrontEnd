import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../core/models/IUser';
import {
  authFailure,
  login,
  loginSuccess,
  logout,
  register,
  registerError,
  registerSuccess,
  verifyOtp,
  verifyOtpSuccess,
} from './user.action';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(register, (state) => ({ ...state, loading: true, error: null })),
  on(registerSuccess, (state, { email }) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(registerError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(verifyOtp, (state) => ({ ...state, loading: true, error: null })),
  on(verifyOtpSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(logout, () => initialState),
  on(authFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
