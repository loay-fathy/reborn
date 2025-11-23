import { cookies } from "next/headers";

const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2Mzg0ODQxMCwiZXhwIjoxNzY0NDUzMjEwLCJpYXQiOjE3NjM4NDg0MTB9.vB8H0ikfeVXvzFpF96gFjVgtV1Q0gEAQFjkzHm6iY7ODc_SDyNiDETwV2w2O-p8vjNTCWqvJ0zYOy3icwKs0Dw";

export async function PUT(request, { params }) {
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }
    const { id } = await params;
    const body = await request.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`;

    const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        return new Response(
            JSON.stringify({ error: "Failed to update product", details: errorText }),
            { status: res.status }
        );
    }

    const data = await res.json().catch(() => null);

    return new Response(JSON.stringify({
        message: "Product updated successfully",
        data,
    }), {
        status: 200,
    });
}


export async function DELETE(request, { params }) {
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const { id } = await params;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`;

    const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to delete product" }), {
            status: res.status,
        });
    }

    return new Response(null, { status: 204 });
}
