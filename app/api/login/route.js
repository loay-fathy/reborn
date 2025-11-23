import { cookies } from "next/headers";

export async function POST(req) {
  const { username, password } = await req.json();

  // Forward request to external API
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/auth/login/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials", username, password }),
      {
        status: 401,
      }
    );
  }

  const data = await response.json(); // contains token

  const cookieStore = cookies();

  // Save JWT in a secure HttpOnly cookie
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Return user info (without token)
  return Response.json({
    username: data.username,
    fullName: data.fullName,
  });
}
