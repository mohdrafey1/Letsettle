import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const debate = await Debate.findById(params.id).lean();

        if (!debate) {
            return NextResponse.json(
                { error: "Debate not found" },
                { status: 404 }
            );
        }

        const options = await Option.find({ debateId: params.id }).lean();

        return NextResponse.json({ ...debate, options }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch debate" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await request.json();
        const {
            title,
            description,
            category,
            subCategory,
            isActive,
            isMoreOptionAllowed,
            status,
            rejectionReason,
        } = body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (subCategory !== undefined) updateData.subCategory = subCategory;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isMoreOptionAllowed !== undefined)
            updateData.isMoreOptionAllowed = isMoreOptionAllowed;
        if (status !== undefined) updateData.status = status;
        if (rejectionReason !== undefined)
            updateData.rejectionReason = rejectionReason;

        const debate = await Debate.findByIdAndUpdate(params.id, updateData, {
            new: true,
        });

        if (!debate) {
            return NextResponse.json(
                { error: "Debate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, debate }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update debate" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        // First, delete the debate
        const debate = await Debate.findByIdAndDelete(params.id);

        if (!debate) {
            return NextResponse.json(
                { error: "Debate not found" },
                { status: 404 }
            );
        }

        // Cascade delete: Remove all options associated with this debate
        await Option.deleteMany({ debateId: params.id });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Debate and all associated options deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete debate" },
            { status: 500 }
        );
    }
}
