declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN: string;
    DATABASE_URL: string;
    DOMAIN: string;
    HOMESERVER: string;
    HOMESERVER_RESTRICTED: boolean?;
    PORT?: number;
    PREFIX?: string;
    SHADOW_DATABASE_URL: string;
  }
}
