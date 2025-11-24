import { getClientToken } from "@/lib/auth";

export async function GET(request, { params }) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const { id } = await params;

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/download`;

        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            return new Response(
                JSON.stringify({ error: "Failed to download report" }),
                { status: res.status }
            );
        }

        // Forward the file stream
        const headers = new Headers(res.headers);
        // Ensure content-disposition is set if the backend sends it, or set a default
        if (!headers.get("Content-Disposition")) {
            headers.set("Content-Disposition", `attachment; filename="report-${id}.pdf"`);
        }

        return new Response(res.body, {
            status: 200,
            headers: headers,
        });
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
