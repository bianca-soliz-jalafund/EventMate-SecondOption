export class Logger {
  static info(message: string, data?: unknown): void {
    console.log(`[INFO] ${message}`, data || '');
  }

  static error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error || '');
  }

  static warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data || '');
  }

  static debug(message: string, data?: unknown): void {
    console.debug(`[DEBUG] ${message}`, data || '');
  }
}
