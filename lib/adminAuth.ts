// Admin authentication utilities
import { NextRequest } from "next/server";

// Simple admin verification using header token
// In production, replace with proper JWT/session management
export function getAdminFromRequest(request: NextRequest): {
    isAdmin: boolean;
} {
    const adminToken = request.headers.get("x-admin-token");

    // For MVP, we're using a simple token check
    // In production, verify JWT or session
    const isAdmin = adminToken === process.env.ADMIN_SECRET_TOKEN;

    return { isAdmin };
}

export function requireAdmin(request: NextRequest): boolean {
    const { isAdmin } = getAdminFromRequest(request);
    return isAdmin;
}

// Generate a simple admin token (for demo purposes)
export function generateAdminToken(
    username: string,
    password: string
): string | null {
    // In production, verify against hashed password in database
    // For MVP, using environment variable
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return process.env.ADMIN_SECRET_TOKEN || "admin-token-secret";
    }

    return null;
}
