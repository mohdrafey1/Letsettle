import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vote from "@/models/Vote";
import Analytics from "@/models/Analytics";
import Debate from "@/models/Debate";
import { requireAdmin } from "@/lib/adminAuth";
import { startOfDay, subDays } from "date-fns";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// Helper to fill missing dates with 0
const fillMissingDates = (
    data: { _id: string; count: number }[],
    days: number
) => {
    const result = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
        const found = data.find((d) => d._id === dateStr);
        result.push({
            date: dateStr,
            count: found ? found.count : 0,
        });
    }
    return result;
};

export async function GET(req: NextRequest) {
    try {
        const isAdmin = requireAdmin(req);
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "7d"; // 7d, 30d, all
        const debateId = searchParams.get("debateId");

        let days = 7;
        if (range === "30d") days = 30;
        if (range === "all") days = 365; // High limit for 'all' in this simple implementations

        const startDate = subDays(startOfDay(new Date()), days);

        // 1. Vote Stats (Aggregated by day)
        // using createdAt which is standard in Mongoose timestamps
        const voteStatsRaw = await Vote.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const voteStats = fillMissingDates(voteStatsRaw, days);

        // 2. Site View Stats (From Analytics model)
        const siteStatsRaw = await Analytics.aggregate([
            {
                $match: {
                    type: "site_views",
                    date: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    },
                    count: { $sum: "$count" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const siteStats = fillMissingDates(siteStatsRaw, days);

        // 3. Top Debates (By total views in the selected range or overall)
        // Note: For top debates list, we might just want to show top by total views from Debate model
        // OR top gaining in the last X days from Analytics.
        // For simplicity, let's return Top 5 viewed debates (All time) and if debateId is provided, specific stats.

        let debateStats = null;
        let topDebates = [];

        if (debateId) {
            const specificDebateStatsRaw = await Analytics.aggregate([
                {
                    $match: {
                        type: "debate_views",
                        entityId: new mongoose.Types.ObjectId(debateId),
                        date: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$date",
                            },
                        },
                        count: { $sum: "$count" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            debateStats = fillMissingDates(specificDebateStatsRaw, days);
        } else {
            // Get top 10 debates by total views
            topDebates = await Debate.find()
                .sort({ views: -1 })
                .limit(10)
                .select("title slug views totalVotes category");
        }

        return NextResponse.json({
            voteStats,
            siteStats,
            debateStats,
            topDebates,
        });
    } catch (error) {
        console.error("Admin Analytics Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
