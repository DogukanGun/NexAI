import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  uri: process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost:5432/postgres',
}));