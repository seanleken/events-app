import { sql } from './db';

export type User = {
  id: string;
  auth0_id: string;
  username: string;
};

export const getUser = async (auth0Id: number): Promise<User | undefined> => {
  const queryresult = await sql<User[]>`
        select * from users where auth0_id = ${auth0Id}
    `;

  return queryresult[0];
};

export const addUser = (user: User) => {
  return sql`insert into users (id, username, auth0_id) values (${user.id}, ${user.username}, ${user.auth0_id})`;
};
