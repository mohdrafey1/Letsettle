import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Option from "@/models/Option";
import Debate from "@/models/Debate";
import OptionRateLimit from "@/models/OptionRateLimit";
import { analyzeOptionContent } from "@/lib/ai-moderator";
import { headers } from "next/headers";

const MAX_DAILY_OPTIONS = 10;

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const body = await request.json();
        const { debateId, name } = body;

        if (!debateId || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Rate Limiting Logic
        const headersList = headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const today = new Date().toISOString().split("T")[0];

        if (ip !== "unknown") {
            const rateLimit = await OptionRateLimit.findOne({
                ip,
                date: today,
            });

            if (rateLimit) {
                if (rateLimit.count >= MAX_DAILY_OPTIONS) {
                    return NextResponse.json(
                        {
                            error: `Daily limit reached. You can add up to ${MAX_DAILY_OPTIONS} options per day.`,
                        },
                        { status: 429 }
                    );
                }
            }
        }

        // 2. Check for duplicate option (case-insensitive)
        const existingOption = await Option.findOne({
            debateId,
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        if (existingOption) {
            return NextResponse.json(
                { error: "This option already exists" },
                { status: 409 }
            );
        }

        // 3. AI Moderation & Relevance Check
        const debate = await Debate.findById(debateId);
        if (!debate) {
            return NextResponse.json(
                { error: "Debate not found" },
                { status: 404 }
            );
        }

        const analysis = await analyzeOptionContent(
            debate.title,
            debate.description,
            name
        );

        if (analysis.status === "pending") {
            return NextResponse.json(
                {
                    error:
                        analysis.reason || "Option rejected by AI moderator.",
                },
                { status: 400 }
            );
        }

        // 4. Create Option & Update Rate Limit
        const newOption = await Option.create({
            debateId,
            name: name.trim(),
        });

        if (ip !== "unknown") {
            await OptionRateLimit.findOneAndUpdate(
                { ip, date: today },
                { $inc: { count: 1 }, $set: { lastRequest: new Date() } },
                { upsert: true }
            );
        }

        return NextResponse.json(
            {
                ...newOption.toObject(),
                _id: newOption._id.toString(),
                createdAt: newOption.createdAt.toISOString(),
                updatedAt: newOption.updatedAt.toISOString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding option:", error);
        return NextResponse.json(
            { error: "Failed to add option" },
            { status: 500 }
        );
    }
}
