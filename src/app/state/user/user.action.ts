import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/IUser';

export const register = createAction(
  '[Auth] Register',
  props<{ userName: string; email: string; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ email: string }>()
);

export const registerError = createAction(
  '[Auth] Register Fail',
  props<{ error: string }>()
);

export const verifyOtp = createAction(
  '[Auth] Verify OTP',
  props<{ email: string; otp: string }>()
);

export const verifyOtpSuccess = createAction(
  '[Auth] Verify OTP Success',
  props<{ user: User }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth], Login Success',
  props<{ user: User }>()
);

export const logout = createAction('[Auth], Logout');

export const authFailure = createAction(
  '[Auth] Failure',
  props<{ error: string }>()
);
