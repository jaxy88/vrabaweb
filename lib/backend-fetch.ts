import { cookies } from "next/headers";

import { getSession } from "./session";

export async function backendFetch(
  url: string,

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

  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...options.headers,

        Authorization:
          `Bearer ${session.token}`,
      },
    }
  );
}