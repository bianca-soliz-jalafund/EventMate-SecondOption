/**
 * Mapea los códigos de error de Firebase Auth a mensajes amigables para el usuario.
 * @param errorCode El código de error de Firebase (ej: 'auth/user-not-found').
 * @param defaultMessage El mensaje de error original por si no hay un mapeo.
 * @returns Un string con el mensaje para el usuario.
 */
export const mapErrorMessage = (
  errorCode: string,
  defaultMessage: string
): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No se encontró una cuenta con esta dirección de correo electrónico.";
    case "auth/wrong-password":
      return "La contraseña es incorrecta. Por favor, inténtalo de nuevo.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con esta dirección de correo electrónico.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-email":
      return "Por favor, introduce una dirección de correo electrónico válida.";
    case "auth/too-many-requests":
      return "Has intentado iniciar sesión demasiadas veces. Por favor, inténtalo de nuevo más tarde.";
    case "auth/network-request-failed":
      return "Error de red. Por favor, comprueba tu conexión a internet.";
    case "auth/popup-closed-by-user":
      return "El proceso de inicio de sesión fue cancelado.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con este email. Intenta iniciar sesión con otro método (ej: Google) y vincula tus cuentas desde tu perfil.";
    case "auth/requires-recent-login":
      return "Esta acción es sensible y requiere un inicio de sesión reciente. Por favor, cierra sesión y vuelve a iniciarla.";
    case "auth/credential-already-in-use":
      return "Esta credencial (ej: cuenta de Google) ya está vinculada a otro usuario.";
    case "auth/user-disabled":
      return "Esta cuenta de usuario ha sido deshabilitada.";
    case "auth/operation-not-allowed":
      return "El inicio de sesión con este método no está habilitado. Contacta al administrador.";
    default:
      return (
        defaultMessage ||
        "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo."
      );
  }
};
