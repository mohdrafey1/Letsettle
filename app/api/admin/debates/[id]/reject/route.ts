import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await request.json();
        const { reason } = body;

        const debate = await Debate.findByIdAndUpdate(
            params.id,
            {
                status: "rejected",
                rejectionReason: reason || "Rejected by admin",
            },
            { new: true }
        );

        if (!debate) {
            return NextResponse.json(
                { error: "Debate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Debate rejected",
                debate,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to reject debate" },
            { status: 500 }
        );
    }
}
