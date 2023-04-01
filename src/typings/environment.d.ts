declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN: string;
    DATABASE_URL: string;
    HOMESERVER: string;
    PORT?: number;
    SHADOW_DATABASE_URL: string;
  }
}
