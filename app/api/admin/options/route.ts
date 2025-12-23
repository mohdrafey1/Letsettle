import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Option from "@/models/Option";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const searchParams = request.nextUrl.searchParams;
        const debateId = searchParams.get("debateId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const skip = (page - 1) * limit;

        const query: any = {};
        if (debateId) {
            query.debateId = debateId;
        }

        const [options, total] = await Promise.all([
            Option.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Option.countDocuments(query),
        ]);

        // Populate debate information for each option
        const Debate = (await import("@/models/Debate")).default;
        const optionsWithDebate = await Promise.all(
            options.map(async (option) => {
                const debate = await Debate.findById(option.debateId)
                    .select("title slug")
                    .lean();
                return {
                    ...option,
                    debateTitle: debate?.title || "Unknown Debate",
                    debateSlug: debate?.slug || "",
                };
            })
        );

        return NextResponse.json(
            {
                options: optionsWithDebate,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch options" },
            { status: 500 }
        );
    }
}
