# EventMate - Administrador de Eventos Colaborativos

EventMate es una aplicación web para la gestión de eventos que permite crear, gestionar e invitar usuarios a eventos. La aplicación incluye autenticación, gestión de roles, notificaciones push y integración completa con Firebase.

## Características Principales

### Autenticación y Seguridad
- **Registro e inicio de sesión** con email/password y Google
- **Manejo de sesiones** con Firebase Authentication
- **Roles de usuario** (normal y administrador) con control de acceso
- **Rutas protegidas** para usuarios autenticados

### Gestión de Eventos
- **CRUD completo** de eventos (Crear, Leer, Actualizar, Eliminar)
- **Campos del evento**: título, descripción, fecha, lugar, categoría
- **Imagen destacada** opcional para cada evento
- **Sistema de propietarios** e invitados por evento
- **Compartir eventos** mediante invitaciones por correo electrónico

### Almacenamiento de Archivos
- **Subida de imágenes** por evento con validación
- **Visualización de imágenes** en la vista del evento
- **Eliminación automática** de imágenes al eliminar eventos
- **Integración con Firebase Storage**

### Cloud Functions
- **Validación de invitaciones** por email con verificación de usuarios existentes
- **Notificaciones automáticas** cuando los eventos cambian o se cancelan
- **Envío de correos** de invitación para usuarios no registrados
- **Triggers de Firestore** para cambios en tiempo real

### Notificaciones Push
- **Firebase Cloud Messaging** para notificaciones en tiempo real
- **Configuración de usuario** para habilitar/deshabilitar notificaciones
- **Notificaciones automáticas** para:
  - Nuevas invitaciones a eventos
  - Actualizaciones de eventos
  - Cancelación de eventos

## 🏗️ Arquitectura del Proyecto

```
eventmate2/
├── eventmate-react/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # Contextos de React (Auth, Notifications)
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── schemas/         # Esquemas de validación Zod
│   ├── lib/
│   │   ├── models/          # Modelos de datos
│   │   ├── repositories/    # Capa de acceso a datos
│   │   └── services/        # Lógica de negocio
│   └── public/              # Archivos estáticos
└── eventmate-functions/      # Backend Firebase Functions
    └── functions/
        ├── src/
        │   ├── features/     # Funcionalidades organizadas por dominio
        │   └── shared/       # Utilidades compartidas
        └── lib/              # Código compilado (generado automáticamente)
```

## Instalación y Configuración

### Prerrequisitos
- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Cuenta de Firebase** con proyecto configurado

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd EventMate
```

### 2. Configurar Variables de Entorno

#### Frontend (eventmate-react)
Crear archivo `.env` en `eventmate-react/`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# VAPID Key para notificaciones push
VITE_VAPID_KEY=tu_vapid_key

# Collections de Firestore
VITE_EVENTS_COLLECTION=events
VITE_INVITATIONS_COLLECTION=invitations
```
### 3. Instalar Dependencias

#### Frontend
```bash
cd eventmate-react
npm install
```

#### Backend
```bash
cd eventmate-functions/functions
npm install
```

### 4. Configurar Firebase

#### Iniciar sesión en Firebase
```bash
firebase login
```

#### Seleccionar proyecto
```bash
firebase use tu_proyecto_id
```

#### Configurar reglas de Firestore
```bash
firebase deploy --only firestore:rules
```

#### Configurar reglas de Storage
```bash
firebase deploy --only storage
```

## Ejecución del Proyecto

### Desarrollo Local

#### Frontend
```bash
cd eventmate-react
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

#### Backend (Cloud Functions)
```bash
cd eventmate-functions/functions
npm run build
npm run serve
```

---