// src/types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * API 密钥，用于身份验证或访问某些服务。
     */
    API_KEY: string;

    /**
     * 应用程序的唯一标识符。
     */
    APP_ID: string;

    /**
     * 服务器的 IP 地址。
     */
    SERVER_IP: string;
    REDIS_PASSPORT: string;
  }
}
