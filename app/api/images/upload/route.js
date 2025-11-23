import { cookies } from "next/headers";

export async function POST(request) {
    //   const token = cookies().get("token")?.value;
    const token =
        "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2Mzg0ODQxMCwiZXhwIjoxNzY0NDUzMjEwLCJpYXQiOjE3NjM4NDg0MTB9.vB8H0ikfeVXvzFpF96gFjVgtV1Q0gEAQFjkzHm6iY7ODc_SDyNiDETwV2w2O-p8vjNTCWqvJ0zYOy3icwKs0Dw";

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const formData = await request.formData();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/images/upload`;

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to upload image" }), {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}
