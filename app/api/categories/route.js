import { getClientToken } from "@/lib/auth";

export async function GET(request) {
  const token = getClientToken(request);


  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Request categories from your external API
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
      status: res.status,
    });
  }

  const data = await res.json();

  // Return only id and name for each category
  const categories = data.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return Response.json(categories);
}

export async function POST(request) {
  const token = getClientToken(request);

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let parsedError;

      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = errorText || "Unknown error";
      }

      return new Response(
        JSON.stringify({
          error: "Failed to create category",
          details: parsedError,
        }),
        { status: res.status }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

