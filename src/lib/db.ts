import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import postgres from 'postgres';

export const sql = postgres(import.meta.env.DB_CONNECTION_STRING);

export const adapter = new PostgresJsAdapter(sql, {
  user: 'users',
  session: 'user_sessions',
});
