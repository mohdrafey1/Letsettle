import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import { slugify } from "@/lib/utils";
import {
    validateDebateTitle,
    validateDebateDescription,
    validateOptions,
    getUserIdentifier,
} from "@/lib/validators";

export async function GET(request: NextRequest) {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");

    const query: {
        isActive: boolean;
        category?: string;
        subCategory?: string;
        status?: string;
    } = { isActive: true, status: "approved" };

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    try {
        const debates = await Debate.find(query)
            .sort({ totalVotes: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        // Fetch top options for each debate to display on frontend
        const debatesWithOptions = await Promise.all(
            debates.map(async (debate) => {
                const topOptions = await Option.find({ debateId: debate._id })
                    .sort({ votes: -1 })
                    .limit(3)
                    .lean();
                return { ...debate, options: topOptions };
            })
        );

        return NextResponse.json(debatesWithOptions, { status: 200 });
    } catch (_) {
        return NextResponse.json(
            { error: "Failed to fetch debates" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const body = await request.json();
        const { title, description, category, subCategory, options } = body;

        // Basic validation
        if (
            !title ||
            !category ||
            !Array.isArray(options) ||
            options.length < 2
        ) {
            return NextResponse.json(
                {
                    error: "Invalid input. Title, Category, and at least 2 Options are required.",
                },
                { status: 400 }
            );
        }

        // Validate title
        const titleValidation = validateDebateTitle(title);
        if (!titleValidation.valid) {
            return NextResponse.json(
                { error: titleValidation.error },
                { status: 400 }
            );
        }

        // Validate description
        if (description) {
            const descValidation = validateDebateDescription(description);
            if (!descValidation.valid) {
                return NextResponse.json(
                    { error: descValidation.error },
                    { status: 400 }
                );
            }
        }

        // Validate options
        const optionsValidation = validateOptions(options);
        if (!optionsValidation.valid) {
            return NextResponse.json(
                { error: optionsValidation.error },
                { status: 400 }
            );
        }

        const slug = slugify(title);

        // Check if slug exists
        const existingDebate = await Debate.findOne({ slug });
        if (existingDebate) {
            return NextResponse.json(
                { error: "Debate with this title already exists." },
                { status: 409 }
            );
        }

        // Get user identifier
        const createdBy = getUserIdentifier(request);

        try {
            const debate = await Debate.create({
                slug,
                title: title.trim(),
                description: description?.trim(),
                category,
                subCategory,
                status: "pending", // Set to pending for moderation
                createdBy,
            });

            const optionDocs = options.map((optName: string) => ({
                debateId: debate._id,
                name: optName.trim(),
            }));

            await Option.insertMany(optionDocs);

            return NextResponse.json(
                {
                    success: true,
                    slug,
                    message:
                        "Debate submitted successfully! It will be visible after admin approval.",
                },
                { status: 201 }
            );
        } catch (err) {
            throw err;
        }
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || "Server error" },
            { status: 500 }
        );
    }
}
