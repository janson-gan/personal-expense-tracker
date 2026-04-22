import app from './app';
import config from './config/app.config';
import logger from './utils/logger';
import { dbConnection } from './db/sequelize';

app.listen(config.PORT, () => {
  logger.info(
    `Backend Server started listening at http://localhost:${config.PORT}`,
  );
});

dbConnection();
