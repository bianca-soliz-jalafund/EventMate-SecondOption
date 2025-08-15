import { Mail } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";
import Dialog from "./ui/Dialog";
import InputForm from "./InputForm";

const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 3 3 9-3 9 19-9Z" />
    <path d="M6 12h16" />
  </svg>
);

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}

const InviteDialog = ({ isOpen, onClose, onConfirm }: InviteDialogProps) => {
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    if (!email.includes("@")) return;
    onConfirm(email);
    setEmail("");
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800">
        {/* Encabezado con Icono */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <PaperAirplaneIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-6 text-slate-900 dark:text-slate-50">
            Invitar a un miembro
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ingresa su correo electrónico para enviarle una invitación.
          </p>
        </div>

        {/* Formulario usando el nuevo InputForm */}
        <div className="mt-6">
          <InputForm
            id="emailSendInvite"
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            isRequired
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />} // <-- La clave para el padding y el estilo
            clearable // <-- Añadimos la opción de limpiar el campo
            onClear={() => setEmail("")} // <-- La función que se ejecuta al limpiar
          />
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="w-full justify-center sm:w-auto text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!email.includes("@")} // Lógica de validación
            className="w-full justify-center sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar invitación
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default InviteDialog;
