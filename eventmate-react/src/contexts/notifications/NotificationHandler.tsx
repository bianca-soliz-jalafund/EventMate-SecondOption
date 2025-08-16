import type { MessagePayload } from "firebase/messaging";
import { toast } from "sonner";

const notificationHandler = async (payload: MessagePayload) => {
  console.log("Manejando notificación en primer plano:", payload);

  // Ahora las notificaciones solo vienen en data, no en notification
  const title = payload.data?.title || "Notificación";
  const body = payload.data?.body || "Nueva notificación recibida";

  // Mostrar toast para notificaciones en primer plano
  toast.info(title, {
    description: body,
  });

  if (payload.data?.type === "event_cancelled") {
    console.log("Evento cancelado, se deberían refrescar los datos de eventos.");
  }

  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }
  
  console.log("Notification received:", payload);
  
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    console.log("Notification permission granted");

    if (payload.data?.type === "event_cancelled") {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } else {
    console.warn("Notification permission denied");
  }
};

export default notificationHandler;
