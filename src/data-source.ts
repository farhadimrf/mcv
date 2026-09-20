import { DataSource, DataSourceOptions } from 'typeorm';

let dbOptions: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dbOptions = {
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
      synchronize: false,
    };
    break;

  case 'test':
    dbOptions = {
      type: 'better-sqlite3',
      database: 'test.sqlite',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
      migrationsRun: true,
      synchronize: false,
    };
    break;

  case 'production':
    dbOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    };
    break;

  default:
    throw new Error('Unknown environment: NODE_ENV is not defined');
}

export const AppDataSource = new DataSource(dbOptions!);
