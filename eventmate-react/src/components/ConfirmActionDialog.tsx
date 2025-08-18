import Button from "./ui/Button";
import Dialog from "./ui/Dialog";

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

interface ConfirmDialogProps {
  isOpen: boolean;
  targetName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  isOpen,
  targetName,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      {/* Contenedor principal del diálogo */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex items-start gap-4">
          {/* Círculo con el icono */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          {/* Contenido de texto */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              ¿Estás seguro?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Estás a punto de eliminar permanentemente{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {targetName}
              </span>
              . Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost" // Asumimos que "ghost" tiene un fondo transparente y color de texto sutil
            onClick={onClose}
            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive" // Asumimos que "destructive" usa colores de peligro
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 text-white"
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
