import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import DebateCard from "@/components/DebateCard";
import Option from "@/models/Option";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
    params: { category: string; subCategory: string };
}

async function getDebatesBySubCategory(category: string, subCategory: string) {
    await dbConnect();

    const catRegex = new RegExp(`^${category}$`, "i");
    const subRegex = new RegExp(`^${subCategory}$`, "i");

    const debates = await Debate.find({
        category: catRegex,
        subCategory: subRegex,
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
    const subTitle = decodeURIComponent(params.subCategory);
    return {
        title: `${subTitle} Debates - Letsettle`,
        description: `Vote on ${subTitle} debates.`,
    };
}

export default async function SubCategoryPage({ params }: PageProps) {
    const categoryDecoded = decodeURIComponent(params.category);
    const subCategoryDecoded = decodeURIComponent(params.subCategory);

    const debates = await getDebatesBySubCategory(
        categoryDecoded,
        subCategoryDecoded
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link
                href={`/category/${params.category}`}
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" />
                Back to {categoryDecoded}
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {subCategoryDecoded} Debates
                </h1>
                <p className="text-gray-500">Category: {categoryDecoded}</p>
            </div>

            {debates.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">
                        No debates found in this subcategory.
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
