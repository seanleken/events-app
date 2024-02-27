import { lucia, type Session } from '../../lib/auth';
import type { APIContext } from 'astro';

export async function GET(context: APIContext): Promise<Response> {
  const session = (context.locals as { session: Session }).session;
  if (!(context.locals as { session: { id: string } }).session) {
    return new Response(null, {
      status: 401,
    });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect('/');
}
