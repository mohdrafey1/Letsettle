import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const token = generateAdminToken(username, password);

        if (!token) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { token, message: "Login successful" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
