declare module 'expo-sqlite' {
  export interface Database {
    exec(
      sql: string,
      args?: (string | number | null)[],
      success?: () => void,
      error?: (err: any) => void
    ): void;
  }

  export function openDatabase(
    name: string,
    version?: string,
    description?: string,
    size?: number
  ): Database;

  export function openDatabaseSync(name: string): Database;
}
