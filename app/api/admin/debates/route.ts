import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
    // Verify admin
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status") || "all";
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const limit = parseInt(searchParams.get("limit") || "50");
        const page = parseInt(searchParams.get("page") || "1");

        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (status !== "all") {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const debates = await Debate.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Debate.countDocuments(query);

        // Get option counts for each debate
        const debatesWithCounts = await Promise.all(
            debates.map(async (debate) => {
                const optionCount = await Option.countDocuments({
                    debateId: debate._id,
                });
                return { ...debate, optionCount };
            })
        );

        return NextResponse.json(
            {
                debates: debatesWithCounts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch debates" },
            { status: 500 }
        );
    }
}
