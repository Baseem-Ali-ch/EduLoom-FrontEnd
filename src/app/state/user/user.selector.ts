import { createSelector, select } from "@ngrx/store"
import { AuthState } from "../../core/models/IUser"
import { AppState } from "./user.state";

export const selectRegistrationState = (state: AppState) => state.registration;

export const selectUser  = createSelector(
    selectRegistrationState,
    (state: AuthState) => state.user
);

export const selectError = createSelector(
    selectRegistrationState,
    (state: AuthState) => state.error
);

export const selectIsLoading = createSelector(
    selectRegistrationState,
    (state: AuthState) => state.loading
);