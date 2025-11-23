import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2MzE5NDQ4NSwiZXhwIjoxNzYzNzk5Mjg1LCJpYXQiOjE3NjMxOTQ0ODV9.3mE80Lp95QdRmS2pNQkvWCX2ca_2ntipWrGnVJv6NTsBGOLHEZSU5bJcKnCwwgtXYUrT74yk0sZrrLWidOkCdw";
  // const token = cookies().get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Customer ID is required" }), {
      status: 400,
    });
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch customer data" }),
        {
          status: res.status,
        }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
