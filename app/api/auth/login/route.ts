import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import { createSession } from "@/lib/session";



export async function POST(
    req: Request
) {

    const body = await req.json();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },
            credentials: "include",

            body: JSON.stringify(body),
        }
    );

    const result =
        await response.json();
    if (!response.ok) {
        return NextResponse.json(
            result,
            {
                status: response.status,
            }
        );
    }

    const sid =
        await createSession({
            token:
                result.token,

            //refreshToken:
            //result.refresh_token,

            user: result.user,

            role: result.role,
        });

    const cookieStore =
        await cookies();

    cookieStore.set("sid", sid, {
        httpOnly: true,

        secure:
            process.env.NODE_ENV ===
            "production",

        sameSite: "strict",

        path: "/",

        maxAge:
            60 * 60 * 24 * 7,
    });

    return NextResponse.json({
        success: true,
    });
}