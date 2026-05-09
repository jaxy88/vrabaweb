import crypto from "crypto";

import { redis } from "./redis";

export async function createSession(
  data: unknown
) {
  try {
    const sid =
      crypto.randomUUID();

    const result =
      await redis.set(
        `session:${sid}`,
        JSON.stringify(data),
        "EX",
        60 * 60 * 24 * 7
      );

    console.log(
      "REDIS RESULT:",
      result
    );

    return sid;
  } catch (error) {
    console.error(
      "REDIS ERROR:",
      error
    );

    throw error;
  }
}

export async function getSession(
  sid: string
) {
  const data =
    await redis.get(
      `session:${sid}`
    );

  if (!data) return null;

  return JSON.parse(data);
}