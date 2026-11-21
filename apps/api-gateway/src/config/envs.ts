import { config } from 'dotenv';
import * as joi from 'joi';
import { resolve } from 'node:path';

config({
  path: resolve(process.cwd(), 'apps/api-gateway/.env'),
});

interface EnvConfig {
  PORT: number;
  KAFKA_BROKER: string[];
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    KAFKA_BROKER: joi.array().items(joi.string().trim().min(1)).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  KAFKA_BROKER: process.env.KAFKA_BROKER?.split(',').map((broker) =>
    broker.trim(),
  ),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars = value as EnvConfig;

export const envs = {
  PORT: envVars.PORT,
  KAFKA_BROKER: envVars.KAFKA_BROKER,
};
