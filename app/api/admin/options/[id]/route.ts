import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Option from "@/models/Option";
import { requireAdmin } from "@/lib/adminAuth";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const option = await Option.findByIdAndDelete(params.id);

        if (!option) {
            return NextResponse.json(
                { error: "Option not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Option deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete option" },
            { status: 500 }
        );
    }
}
