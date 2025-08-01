export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  url: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  privateKeyEncryptionKey: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  defaultFrom: string;
}

export interface SmsConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  appName: string;
}

export interface LoggerConfig {
  level: string;
  filePath?: string;
  dbLogging: boolean;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  email: EmailConfig;
  sms: SmsConfig;
  logger: LoggerConfig;
}
