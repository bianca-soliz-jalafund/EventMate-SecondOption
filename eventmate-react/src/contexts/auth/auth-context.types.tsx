import type { UserRole } from "@lib/models/UserConfiguration";
import type { User } from "firebase/auth";

export interface AuthUser extends User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean;
}

export interface SignInMethods {
  email: boolean;
  google: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<void>;
  signInWithGoogle(): Promise<void>;
  linkGoogleAccount(): Promise<void>;
  linkEmailAccount(email: string, password: string): Promise<void>;
  getSignInMethods(email: string): Promise<SignInMethods>;
  logout(): Promise<void>;
  clearError(): void;
}
