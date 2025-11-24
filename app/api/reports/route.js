import { getClientToken } from "@/lib/auth";

export async function GET(request) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get("pageNumber") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const type = searchParams.get("type");
    const date = searchParams.get("date");

    try {
        const queryParams = new URLSearchParams({
            pageNumber,
            pageSize,
        });

        if (type && type !== "all") {
            queryParams.append("type", type);
        }
        if (date) {
            queryParams.append("date", date);
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports?${queryParams.toString()}`;

        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
                    error: "Failed to fetch reports",
                    details: parsedError,
                }),
                { status: res.status }
            );
        }

        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
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
