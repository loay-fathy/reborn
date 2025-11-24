import { getClientToken } from "@/lib/auth";

export async function GET(request) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    // Get query parameters from request
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const pageNumber = searchParams.get("pageNumber") || "1";
    const pageSize = searchParams.get("pageSize") || "10";

    // Build query string for external API
    const queryParams = new URLSearchParams();
    if (search) {
        queryParams.append("search", search);
    }
    queryParams.append("pageNumber", pageNumber);
    queryParams.append("pageSize", pageSize);

    const queryString = queryParams.toString();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses${queryString ? `?${queryString}` : ""}`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to fetch expenses:", res.status, errorText);
            return new Response(JSON.stringify({ error: "Failed to fetch expenses" }), {
                status: res.status,
            });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching expenses:", error);
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
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses`;

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
                    error: "Failed to create expense",
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
