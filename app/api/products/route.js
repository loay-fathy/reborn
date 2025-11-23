import { cookies } from "next/headers";

const token =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2Mzg0ODQxMCwiZXhwIjoxNzY0NDUzMjEwLCJpYXQiOjE3NjM4NDg0MTB9.vB8H0ikfeVXvzFpF96gFjVgtV1Q0gEAQFjkzHm6iY7ODc_SDyNiDETwV2w2O-p8vjNTCWqvJ0zYOy3icwKs0Dw";

export async function GET(request) {
  //   const token = cookies().get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Get query parameters from request
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const pageNumber = searchParams.get("pageNumber") || "1";
  const pageSize = searchParams.get("pageSize") || "10";

  // Build query string for external API
  const queryParams = new URLSearchParams();
  if (categoryId) {
    queryParams.append("categoryId", categoryId);
  }
  if (search) {
    queryParams.append("search", search);
  }
  queryParams.append("pageNumber", pageNumber);
  queryParams.append("pageSize", pageSize);

  const queryString = queryParams.toString();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products${queryString ? `?${queryString}` : ""}`;

  // Request products from your external API
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // If your API needs other headers, add them here
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: res.status,
    });
  }

  const data = await res.json();
  return Response.json(data);
}

export async function POST(request) {
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to create product" }), {
      status: res.status,
    });
  }

  const data = await res.json();
  return Response.json(data);
}
