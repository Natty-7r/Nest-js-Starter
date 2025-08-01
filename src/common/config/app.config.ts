// src/config/config.ts
import * as dotenv from 'dotenv';
import { configValidationSchema } from 'src/utils/helpers/schema.helper';
import {
  AppConfig,
  AuthConfig,
  Config,
  DatabaseConfig,
  EmailConfig,
  LoggerConfig,
  SmsConfig,
} from 'src/utils/types/config.type';

export function loadConfig(): Config {
  dotenv.config();
  /* eslint-disable*/
  const { error, value: envVars } = configValidationSchema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  // Build config object
  const config: Config = {
    app: getAppConfig(envVars),
    database: getDatabaseConfig(envVars),
    auth: getAuthConfig(envVars),
    email: getEmailConfig(envVars),
    sms: getSmsConfig(envVars),
    logger: getLoggerConfig(envVars),
  };

  return config;
}

/* eslint-disable*/
function getAppConfig(envVars: Record<string, any>): AppConfig {
  return {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    appName: envVars.APP_NAME,
  };
}

function getDatabaseConfig(envVars: Record<string, any>): DatabaseConfig {
  return {
    host: envVars.DATABASE_HOST,
    port: envVars.DATABASE_PORT,
    username: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    name: envVars.DATABASE_NAME,
    url: envVars.DATABASE_URL,
  };
}

function getAuthConfig(envVars: Record<string, any>): AuthConfig {
  return {
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    privateKeyEncryptionKey: envVars.PRIVATE_KEY_ENCRYPTION_KEY,
  };
}

function getEmailConfig(envVars: Record<string, any>): EmailConfig {
  return {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    secure: envVars.EMAIL_SECURE,
    auth: {
      user: envVars.EMAIL_USER,
      pass: envVars.EMAIL_PASSWORD,
    },
    defaultFrom: envVars.EMAIL_DEFAULT_FROM,
  };
}

function getSmsConfig(envVars: Record<string, any>): SmsConfig {
  return {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    fromNumber: envVars.TWILIO_FROM_NUMBER,
  };
}

function getLoggerConfig(envVars: Record<string, any>): LoggerConfig {
  return {
    level: envVars.LOG_LEVEL,
    filePath: envVars.LOG_FILE_PATH,
    dbLogging: envVars.DB_LOGGING,
  };
}

// Load and export the config
const config = loadConfig();
export default config;
