import { cookies } from "next/headers";

import { getSession } from "./session";

export async function backendFetch(
  endpoint: string,

  options: RequestInit = {}
) {
  const cookieStore =
    await cookies();

  const sid =
    cookieStore.get("sid")
      ?.value;

  if (!sid) {
    throw new Error(
      "Unauthorized"
    );
  }

  const session =
    await getSession(sid);

  if (!session) {
    throw new Error(
      "Session expired"
    );
  }

  const headers =
    new Headers(
      options.headers
    );

  headers.set(
    "Content-Type",
    "application/json"
  );

  headers.set(
    "Authorization",
    `Bearer ${session.token}`
  );

  return fetch(
    `${process.env.API_URL}${endpoint}`,
    {
      ...options,

      headers,
    }
  );
}