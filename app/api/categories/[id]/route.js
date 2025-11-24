import { getClientToken } from "@/lib/auth";

export async function PUT(request, { params }) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`;

        const res = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            let parsed = {};

            try {
                parsed = JSON.parse(errorText);
            } catch {
                parsed = errorText;
            }

            return new Response(
                JSON.stringify({ error: "Failed to update category", details: parsed }),
                { status: res.status }
            );
        }

        const successText = await res.text();
        let data = null;

        try {
            data = successText ? JSON.parse(successText) : null;
        } catch {
            data = successText;
        }

        return new Response(
            JSON.stringify({ message: "Category updated successfully", data }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: error.message }),
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    const token = getClientToken(request);

    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = await params;

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`;

        const res = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            let parsed = {};

            try {
                parsed = JSON.parse(errorText);
            } catch {
                parsed = errorText;
            }

            return new Response(
                JSON.stringify({ error: "Failed to delete category", details: parsed }),
                { status: res.status }
            );
        }

        return new Response(
            JSON.stringify({ message: "Category deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Internal Server Error", details: error.message }),
            { status: 500 }
        );
    }
}
