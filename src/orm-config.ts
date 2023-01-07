import { DataSourceOptions, LoggerOptions } from 'typeorm';

export interface ConfigOptions
  extends Pick<DataSourceOptions, 'entities' | 'migrations'> {
  url: string;
  ssl: boolean;
  synchronize: boolean;
  logging: LoggerOptions;
  // available only for @nest/typeorm module
  autoLoadEntities?: boolean;
}

export const createConfig = ({
  url,
  ssl,
  synchronize,
  logging,
  ...options
}: ConfigOptions) => {
  let config: DataSourceOptions = {
    type: 'postgres' as const,
    url,
    migrationsRun: false,
    migrationsTableName: 'migrations',
    extra: {
      ssl,
      rejectUnauthorized: false,
      connectionLimit: 5,
    },
    synchronize,
    logging,
    ...options,
  };

  return config;
};
