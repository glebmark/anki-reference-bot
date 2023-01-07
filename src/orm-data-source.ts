import { DataSource } from 'typeorm';
import { createConfig } from './orm-config';

// WORKAROUND for Error: self signed certificate
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const createDataSource = () => {
  const dataSource = new DataSource(
    createConfig({
      url: process.env.DB_URL,
      ssl: process.env.DB_SSL === 'true',
      synchronize: process.env.SYNCHRONIZE === 'true',
      logging: process.env.LOG_QUERIES === 'true' ? 'all' : ['error'],
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      migrations: [__dirname + '/**/migrations/*.{js,ts}'],
    }),
  );

  return dataSource;
};

export default createDataSource();
