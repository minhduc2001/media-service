import dotenv from "dotenv";
import * as ip from "ip";

dotenv.config();

const _process = { env: process.env };
process.env = {};

export class Env {
  NODE_ENV = "development";
  PORT = _process.env.PORT ?? 8080;

  IP = ip.address();
  API_VERSION = "1";

  // db
  DB_DATABASE = _process.env.DB_DATABASE;
  DB_PASSWORD = _process.env.DB_PASSWORD;
  DB_USERNAME = _process.env.DB_USERNAME;
  DB_HOST = _process.env.DB_HOST;
  DB_PORT = Number(_process.env.DB_PORT) ?? 5432;

  // jwt
  JWT_SECRET = _process.env.JWT_SECRET as string;
  JWT_RT_SECRET = _process.env.JWT_RT_SECRET;

  // mailer
  EMAIL = _process.env.EMAIL;
  MAIL_PASSWORD = _process.env.MAIL_PASSWORD;

  // file
  MAX_FILE_SIZE = 10000000; // 10MB;
  UPLOAD_LOCATION = "uploads";

  // Momo
  PARTNER_CODE = _process.env.PARTNER_CODE;
  ACCESS_KEY = _process.env.ACCESS_KEY;
  SECRET_KEY = _process.env.SECRET_KEY;
  ENVIRONMENT = _process.env.ENVIRONMENT ?? "sandbox";

  // Redis
  REDIS_HOST = _process.env.REDIS_HOST;
  REDIS_PORT = Number(_process.env.REDIS_PORT) ?? 4369;

  STOGARE_BUCKET = _process.env.STOGARE_BUCKET;

  SENDER_ID = _process.env.SENDER_ID;
  SERVER_KEY = _process.env.SERVER_KEY;
}

export const envConfig = new Env();
