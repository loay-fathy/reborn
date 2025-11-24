import { getClientToken } from "@/lib/auth";

export async function GET(request) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses/summary`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to fetch expenses summary:", res.status, errorText);
            return new Response(JSON.stringify({ error: "Failed to fetch expenses summary" }), {
                status: res.status,
            });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching expenses summary:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
