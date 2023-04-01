declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN: string;
    DATABASE_URL: string;
    DOMAIN: string;
    HOMESERVER: string;
    PORT?: number;
    PREFIX?: string;
    SHADOW_DATABASE_URL: string;
  }
}
