import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import logger from '../utils/logger';
import { User } from '../models';

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [User],
});

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection to DB successfully.');
  } catch (error) {
    logger.error(`Unable to connect to DB: ${error}`);
  }
};
