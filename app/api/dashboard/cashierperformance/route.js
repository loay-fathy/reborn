import { cookies } from "next/headers";

export async function GET(request) {
    //   const token = cookies().get("token")?.value;
    const token =
        "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2MzgwNzI2OCwiZXhwIjoxNzY0NDEyMDY4LCJpYXQiOjE3NjM4MDcyNjh9.s3wkst8J2bk1H4AqBq4SzTTFZeuhCXfwUNtw2pcV7mMhTL5QXedtxVmIby37imIk_PHYVT3A5wc_3sBdiKzpCg";

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/cashierperformance`;

    const res = await fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch cashier performance" }), {
            status: res.status,
        });
    }

    const data = await res.json();
    return Response.json(data);
}
