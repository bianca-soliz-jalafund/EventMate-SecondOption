/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_STORAGE_BUCKET: string;
  readonly VITE_MESSAGING_SENDER_ID: string;
  readonly VITE_APP_ID: string;
  readonly VITE_VAPID_KEY: string;
  readonly VITE_EVENTS_COLLECTION: string;
  readonly VITE_INVITATIONS_COLLECTION: string;
  readonly VITE_BASE_IMAGE_STORAGE_PATH: string;
  readonly VITE_INVITE_HTTP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
