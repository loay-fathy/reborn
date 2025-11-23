import { cookies } from "next/headers";

export async function GET() {
  //   const token = cookies().get("token")?.value;
  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2MzE5NDQ4NSwiZXhwIjoxNzYzNzk5Mjg1LCJpYXQiOjE3NjMxOTQ0ODV9.3mE80Lp95QdRmS2pNQkvWCX2ca_2ntipWrGnVJv6NTsBGOLHEZSU5bJcKnCwwgtXYUrT74yk0sZrrLWidOkCdw";

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

