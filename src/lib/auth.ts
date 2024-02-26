import { Lucia } from 'lucia';
import { adapter } from './db';
import { Auth0 } from 'arctic';
import type { User } from './users';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: attributes => {
    return {
      id: attributes.id,
      auth0_id: attributes.auth0_id,
      username: attributes.username,
    };
  },
});

export const auth0 = new Auth0(
  import.meta.env.AUTH0_DOMAIN,
  import.meta.env.AUTH0_CLIENT_ID,
  import.meta.env.AUTH0_CLIENT_SECRET,
  import.meta.env.MY_CALLBACK_URL,
);

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = User;
