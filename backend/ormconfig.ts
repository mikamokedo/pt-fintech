import { DataSource } from 'typeorm';
export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'admin',
  password: 'password',
  database: 'todos',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
