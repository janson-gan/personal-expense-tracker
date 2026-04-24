import app from './app';
import config from './config/app.config';
import logger from './utils/logger';
import { dbConnection } from './db/sequelize';
import validateEnv from './utils/validateEnv';

// .env variables validation
validateEnv([
  'JWT_SECRET',
  'DB_PASSWORD',
  'DB_USER',
  'DB_NAME',
  'DB_HOST',
  'DB_PORT',
  'PORT',
  'NODE_ENV',
  'ORIGIN_URL'
]);

app.listen(config.PORT, () => {
  logger.info(
    `Backend Server started listening at http://localhost:${process.env.PORT}`,
  );
});

dbConnection();
