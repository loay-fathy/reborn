import { getClientToken } from "@/lib/auth";

export async function GET(request) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses/categories`;

    try {
        const res = await fetch(apiUrl, {
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
        return Response.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
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
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses/categories`;

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return new Response(JSON.stringify({ error: "Failed to create category", details: errorText }), {
                status: res.status,
            });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
