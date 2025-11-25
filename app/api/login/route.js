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

  const data = await response.json(); // contains toke
  // Return user info and token
  return Response.json({
    token: data.token,
    username: data.username,
    fullName: data.fullName,
    permissions: data.permissions,
    role: data.role,
    imageUrl: data.imageUrl,
  });
}
