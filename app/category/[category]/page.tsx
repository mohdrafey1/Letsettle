import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import DebateCard from "@/components/DebateCard";
import Option from "@/models/Option"; // Import Option to populate
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Reusing types locally or import better
export const dynamic = "force-dynamic";

interface PageProps {
    params: { category: string };
}

async function getDebatesByCategory(category: string) {
    await dbConnect();

    // Case insensitive match
    const regex = new RegExp(`^${category}$`, "i");

    const debates = await Debate.find({
        category: regex,
        isActive: true,
        status: "approved",
    })
        .sort({ totalVotes: -1 })
        .limit(20)
        .lean();

    const debatesWithOptions = await Promise.all(
        debates.map(async (debate) => {
            const topOptions = await Option.find({ debateId: debate._id })
                .sort({ votes: -1 })
                .limit(3)
                .lean();
            return {
                ...debate,
                options: topOptions,
                _id: debate._id.toString(),
            };
        })
    );

    return debatesWithOptions;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const categoryTitle =
        decodeURIComponent(params.category).charAt(0).toUpperCase() +
        decodeURIComponent(params.category).slice(1);
    return {
        title: `${categoryTitle} Debates - Letsettle`,
        description: `Vote on the top ${categoryTitle} debates. Public rankings and discussions.`,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const categoryDecoded = decodeURIComponent(params.category);
    const debates = await getDebatesByCategory(categoryDecoded);

    // Capitalize for display
    const title =
        categoryDecoded.charAt(0).toUpperCase() + categoryDecoded.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" />
                Back to Home
            </Link>

            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {title} Debates
                    </h1>
                    <p className="text-gray-500">
                        Most voted debates in {title}
                    </p>
                </div>

                <Link
                    href="/create"
                    className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                    + Add New
                </Link>
            </div>

            {debates.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">
                        No debates found in this category yet.
                    </p>
                    <Link
                        href="/create"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Start the first one &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {debates.map((debate: any) => (
                        <DebateCard key={debate._id} debate={debate} />
                    ))}
                </div>
            )}
        </div>
    );
}
