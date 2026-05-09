import { cookies }
from "next/headers";

import { redis }
from "@/lib/redis";

import { NextResponse }
from "next/server";

export async function POST() {
  const cookieStore =
    await cookies();

  const sid =
    cookieStore.get("sid")
      ?.value;

  if (sid) {
    await redis.del(
      `session:${sid}`
    );
  }

  cookieStore.delete("sid");

  return NextResponse.json({
    success: true,
  });
}