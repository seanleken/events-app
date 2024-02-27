import { lucia } from './lib/auth';
import { verifyRequestOrigin, type Session, type User } from 'lucia';
import { defineMiddleware } from 'astro:middleware';

type Locals = { session: Session | null; user: User | null };

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== 'GET') {
    const originHeader = context.request.headers.get('Origin');
    const hostHeader = context.request.headers.get('Host');
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }

  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    (context.locals as Locals).user = null;
    (context.locals as Locals).session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }
  (context.locals as Locals).session = session;
  (context.locals as Locals).user = user;
  return next();
});
