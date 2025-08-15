import AlertDialog from "@/components/ConfirmActionDialog";
import EventForm from "@/components/forms/EventForm";
import GridContainer from "@/components/GridContainer";
import InviteDialog from "@/components/InviteDialog";
import Drawer from "@/components/ui/Drawer"; // 1. Importamos nuestro nuevo componente Drawer
import { useAuth } from "@/contexts/auth/AuthContext";
import {
    defaultEventFormData,
    type EventFormData,
} from "@/schemas/event.schema";
import Event from "@lib/models/Event";
import { eventRepository } from "@lib/repositories/implementations/EventRepository";
import { eventService } from "@lib/services/implementations/EventService";
import { useState } from "react";

const MyEventsPage = () => {
  // --- ESTADOS DE LA PÁGINA ---
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  // Estados para controlar el drawer de creación/edición
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // El estado ahora puede ser EventFormData o null
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(
    null
  );
  const [selectedEventInfo, setSelectedEventInfo] = useState<Event | null>(
    null
  );

  // Estados para los otros diálogos
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEventInfo, setInviteEventInfo] = useState<Event | null>(null);

  // --- LÓGICA DE MANEJO DE EVENTOS ---

  /**
   * Se ejecuta al enviar el formulario del Drawer.
   * Crea o actualiza un evento y cierra el drawer al finalizar.
   */
  const handleFormSubmit = async (data: EventFormData) => {
    if (!user) return;

    // --- FIX: Check `selectedEventInfo` to determine the mode ---
    // This is the single source of truth for whether we are editing or creating.
    if (selectedEventInfo) {
      // Modo Actualización: selectedEventInfo is not null, so it has an id.
      const updatedEvent = await eventService.updateEvent(
        data,
        selectedEventInfo.id // This is now safe to access.
      );
      setEvents(
        events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } else {
      // Modo Creación
      const newEvent = await eventService.createEvent(
        data,
        user.uid,
        user.displayName ?? user.email?.split("@")[0] ?? ""
      );
      setEvents([newEvent, ...events]);
    }

    closeAndResetDrawer();
  };

  /**
   * Prepara el estado para crear un nuevo evento y abre el drawer.
   */
  const handleStartCreate = () => {
    setSelectedEvent(defaultEventFormData);
    setSelectedEventInfo(null);
    setIsDrawerOpen(true);
  };

  /**
   * Prepara el estado con los datos de un evento existente y abre el drawer para edición.
   */
  const handleStartEdit = (event: Event) => {
    setSelectedEvent({
      title: event.title,
      description: event.description,
      date: event.date.toISOString().slice(0, 16), // Formato para datetime-local
      image: event.image,
      category: event.category,
      place: event.place ?? "",
    });
    setSelectedEventInfo(event);
    setIsDrawerOpen(true);
  };

  /**
   * Cierra el drawer y limpia el estado del formulario.
   * Utiliza un timeout para que el estado no se limpie durante la animación de cierre.
   */
  const closeAndResetDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
      setSelectedEventInfo(null);
    }, 300); // Coincide con la duración de la animación del Drawer
  };

  // --- Lógica para otros diálogos (Eliminar, Invitar) ---

  const handleStartRemove = (event: Event) => {
    setSelectedEventInfo(event);
    setIsAlertDialogOpen(true);
  };

  const handleRemoveEvent = async () => {
    if (!selectedEventInfo) return;
    await eventService.deleteEventById(selectedEventInfo.id);
    setEvents(events.filter((e) => e.id !== selectedEventInfo.id));
    setIsAlertDialogOpen(false);
    setSelectedEventInfo(null);
  };

  const handleStartEventInvite = (event: Event) => {
    setInviteEventInfo(event);
    setIsInviteDialogOpen(true);
  };

  const handleInviteEvent = async (email: string) => {
    if (!inviteEventInfo) return;
    const response = await eventRepository.addAttendee(
      inviteEventInfo.id,
      email
    );
    if (response?.success) {
      setEvents(
        events.map((e) =>
          e.id === inviteEventInfo.id
            ? {
                ...e,
                invitees: [...e.invitees, email],
                attendeesAmount: e.attendeesAmount + 1,
              }
            : e
        )
      );
    } else {
      console.error("Falló la invitación:", response.message);
    }
    setIsInviteDialogOpen(false);
    setInviteEventInfo(null);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Events Management
        </h1>

        <GridContainer
          events={events}
          setEvents={setEvents}
          onEventEdit={handleStartEdit}
          onEventRemove={handleStartRemove}
          onInviteEvent={handleStartEventInvite}
          gridTypeVisualization="admin"
          className="mb-8"
          filterOptions={{ ownerId: user?.uid }}
        />
      </div>

      {/* Botón Flotante para iniciar la creación de un evento */}
      <button
        type="button"
        onClick={handleStartCreate}
        className="fixed bottom-8 right-8 bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-4xl font-light shadow-lg hover:bg-pink-700 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        aria-label="Create new event"
      >
        +
      </button>

      {/* --- 2. Implementación del Drawer para el formulario de eventos --- */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeAndResetDrawer}
        title={selectedEventInfo ? "Update Event" : "Create New Event"}
      >
        <EventForm
          // La 'key' es crucial: fuerza a React a crear una nueva instancia del formulario
          // al cambiar entre "crear" y "editar", evitando problemas de estado residual.
          key={selectedEventInfo?.id ?? "create"}
          mode={selectedEventInfo ? "update" : "create"}
          onClose={closeAndResetDrawer}
          onSubmit={handleFormSubmit}
          initialData={selectedEvent ?? undefined}
        />
      </Drawer>

      {/* --- Diálogos existentes sin cambios --- */}
      <AlertDialog
        isOpen={isAlertDialogOpen}
        targetName={selectedEventInfo?.title ?? ""}
        onClose={() => {
          setIsAlertDialogOpen(false);
          setSelectedEventInfo(null);
        }}
        onConfirm={handleRemoveEvent}
      />

      <InviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => {
          setIsInviteDialogOpen(false);
          setInviteEventInfo(null);
        }}
        onConfirm={handleInviteEvent}
      />
    </div>
  );
};

export default MyEventsPage;
