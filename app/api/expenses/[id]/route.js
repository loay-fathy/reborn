import { getClientToken } from "@/lib/auth";

export async function PUT(request, { params }) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/expenses/${id}`;

        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        // ---- ERROR HANDLING ----
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
                    error: "Failed to update expense",
                    details: parsedError,
                }),
                { status: res.status }
            );
        }

        // ---- SUCCESS HANDLING ----
        const successText = await res.text();
        let data;

        try {
            data = successText ? JSON.parse(successText) : null;
        } catch {
            data = successText;
        }

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
