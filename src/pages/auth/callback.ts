import { auth0, lucia } from '../../lib/auth';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';

import type { APIContext } from 'astro';
import { addUser, getUser } from '../../lib/users';

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get('code');
  const state = context.url.searchParams.get('state');
  const storedState = context.cookies.get('auth0_oauth_state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await auth0.validateAuthorizationCode(code);
    tokens.idToken;

    const userinfo = await (
      await fetch(`${import.meta.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
    ).json();
    console.log(userinfo);
    const existingUser = await getUser(userinfo.sub);

    if (existingUser) {
      const session = await lucia.createSession(String(existingUser.id), {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return context.redirect('/');
    }

    const userId = generateId(15);

    // Replace this with your own DB client.
    await addUser({
      id: userId,
      auth0_id: userinfo.sub,
      username: userinfo.nickname,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return context.redirect('/');
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      console.error(e);
      return new Response(null, {
        status: 400,
      });
    }
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
}
