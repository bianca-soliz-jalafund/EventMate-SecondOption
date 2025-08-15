/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  EmailAuthProvider,
  updateProfile,
  type AuthError,
} from "firebase/auth";
import { auth } from "@config/firebase.config";
import { mapErrorMessage } from "./error-messages.mapping.utils";

import type {
  AuthContextType,
  AuthUser,
  SignInMethods,
} from "./auth-context.types";
import { userConfigurationRepository } from "@lib/repositories/implementations/UserConfigurationRepository";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("email");
  googleProvider.addScope("profile");

  const clearError = () => setError(null);

  const handleAuthError = (error: AuthError): string => {
    console.error("Auth error:", error);
    return mapErrorMessage(error.code, error.message);
  };

  const getSignInMethods = async (email: string): Promise<SignInMethods> => {
    try {
      console.log("Fetching sign-in methods for email:", email);
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log("METHODS from here  ==> ", methods);
      return {
        email: methods.includes("password"),
        google: methods.includes("google.com"),
      };
    } catch (error) {
      console.error("Error fetching sign-in methods:", error);
      return { email: false, google: false };
    }
  };

  // Email/Password sign in
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsNewUser(false);

      console.log("Email sign-in successful:", result.user.email);
    } catch (error) {
      const authError = error as AuthError;
      setError(handleAuthError(authError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const existingMethods = await getSignInMethods(email);
      if (existingMethods.google) {
        throw new Error(
          "An account already exists with this email using Google. " +
            "Please sign in with Google first, then you can add email/password."
        );
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await userConfigurationRepository.createUserConfiguration(
        result.user.uid,
        email,
        "user"
      );

      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }

      setIsNewUser(true);
      console.log("Email sign-up successful:", result.user.email);
    } catch (error) {
      const authError = error as AuthError;
      setError(handleAuthError(authError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const isNew =
        result.user.metadata.creationTime ===
        result.user.metadata.lastSignInTime;

      if (isNew) {
        await userConfigurationRepository.createUserConfiguration(
          result.user.uid,
          result.user.email as string,
          "user"
        );
      }

      setIsNewUser(isNew);
      console.log("Google sign-in successful:", result.user.email);
    } catch (error) {
      const authError = error as AuthError;

      if (authError.code === "auth/account-exists-with-different-credential") {
        // Handle account linking scenario
        const email = authError.customData?.email as string;
        if (email) {
          const existingMethods = await getSignInMethods(email);
          let methodsText = "";

          if (existingMethods.email) methodsText = "email/password";

          setError(
            `An account already exists with ${email} using ${methodsText}. ` +
              "Please sign in with your existing method first, then you can link your Google account."
          );
        }
      } else {
        setError(handleAuthError(authError));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Link Google account to current user
  const linkGoogleAccount = async () => {
    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    try {
      setLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (credential) {
        await linkWithCredential(user, credential);
        console.log("Google account linked successfully");
      }
    } catch (error) {
      const authError = error as AuthError;
      setError(handleAuthError(authError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Link email/password to current user
  const linkEmailAccount = async (email: string, password: string) => {
    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    try {
      setLoading(true);
      setError(null);

      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);

      console.log("Email/password linked successfully");
    } catch (error) {
      const authError = error as AuthError;
      setError(handleAuthError(authError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setIsNewUser(false);
    } catch (error) {
      const authError = error as AuthError;
      setError(handleAuthError(authError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      if (firebaseUser) {
        const authUser = firebaseUser as AuthUser;
        const role = await userConfigurationRepository.getUserConfigurationById(
          authUser.uid
        );
        if (!role) {
          setUser(null);
          setIsNewUser(false);
        }
        console.log("ROLE from here  ==> ", role);
        authUser.role = role?.role ?? "user";
        setUser(authUser);
      } else {
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    isNewUser,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    linkGoogleAccount,
    linkEmailAccount,
    getSignInMethods,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };