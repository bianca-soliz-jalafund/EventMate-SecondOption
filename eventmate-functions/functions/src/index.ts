import 'module-alias/register';

// Importar todas las Cloud Functions
export {
  inviteUserToEvent,
  inviteUserToEventHTTP,
} from './features/events/handlers/invite-user.handler';

export { onEventsWritten } from './features/events/handlers/event-change.handler';

// Configuración global de Firebase Functions
// Nota: functions.config() ya no está disponible en Firebase Functions v2
