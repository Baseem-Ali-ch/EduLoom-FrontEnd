// user interface
export interface User {
    userName: string,
    email:string,
    password: string
    confirmPassword ?: string
}


export interface AuthState{
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}