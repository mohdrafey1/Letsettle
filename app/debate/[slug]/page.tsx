import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import VoteButton from "@/components/VoteButton";
import AddOptionForm from "@/components/AddOptionForm";
import ShareButton from "@/components/ShareButton";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";

interface PageProps {
    params: { slug: string };
}
export const dynamic = "force-dynamic";

async function getDebate(slug: string) {
    await dbConnect();
    const debate = await Debate.findOne({ slug }).lean();
    if (!debate) return null;

    const options = await Option.find({ debateId: debate._id })
        .sort({ votes: -1 })
        .lean();

    return { ...debate, options, _id: debate._id.toString() };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const debate = await getDebate(params.slug);
    if (!debate) return { title: "Debate Not Found" };

    return {
        title: `${debate.title} - Vote Now | Letsettle`,
        description:
            debate.description ||
            `Vote on ${debate.title}. See live rankings and add your opinion.`,
    };
}

export default async function DebatePage({ params }: PageProps) {
    const debate = await getDebate(params.slug);

    if (!debate) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            {/* Header */}
            <div className="mb-12">
                <div
                    className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wide"
                    style={{
                        backgroundColor: "var(--color-accent-light)",
                        color: "var(--color-accent)",
                        borderRadius: "var(--radius-sm)",
                    }}
                >
                    {debate.category}{" "}
                    {debate.subCategory && `· ${debate.subCategory}`}
                </div>
                <h1
                    className="font-bold leading-tight mb-2"
                    style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--font-size-3xl)",
                    }}
                >
                    {debate.title}
                </h1>
                <div
                    className="text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                >
                    {formatDistanceToNow(new Date(debate.createdAt), {
                        addSuffix: true,
                    })}
                </div>
                {debate.description && (
                    <p
                        className="max-w-2xl"
                        style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "var(--font-size-lg)",
                            lineHeight: "1.6",
                        }}
                    >
                        {debate.description}
                    </p>
                )}

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                    <div
                        className="flex items-center gap-3 text-sm font-mono-numbers"
                        style={{ color: "var(--color-text-tertiary)" }}
                    >
                        <span>{debate.totalVotes} votes</span>
                        <span>·</span>
                        <span>Live results</span>
                    </div>

                    <ShareButton title={debate.title} slug={params.slug} />
                </div>
            </div>

            {/* Options List */}
            <div
                className="p-4 sm:p-8 mb-4 sm:mb-8"
                style={{
                    backgroundColor: "var(--color-base-surface)",
                    border: "1px solid var(--color-base-border)",
                    borderRadius: "var(--radius-sm)",
                }}
            >
                <h2
                    className="font-bold mb-6"
                    style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--font-size-xl)",
                    }}
                >
                    Current Rankings
                </h2>
                <div className="space-y-4">
                    {debate.options.map((opt: any, index: number) => (
                        <div
                            key={opt._id.toString()}
                            className="flex gap-4 items-start"
                        >
                            <div
                                className="font-mono-numbers font-bold w-8 text-right pt-4"
                                style={{
                                    color: "var(--color-text-tertiary)",
                                    fontSize: "var(--font-size-lg)",
                                }}
                            >
                                #{index + 1}
                            </div>
                            <div className="flex-1">
                                <VoteButton
                                    debateId={debate._id}
                                    optionId={opt._id.toString()}
                                    optionName={opt.name}
                                    initialVotes={opt.votes}
                                    totalVotes={debate.totalVotes}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <AddOptionForm
                    debateId={debate._id}
                    isMoreOptionAllowed={debate.isMoreOptionAllowed}
                />
            </div>

            {/* Info Section */}
            <div
                className="p-6 text-center"
                style={{
                    border: "1px solid var(--color-base-border)",
                    borderRadius: "var(--radius-sm)",
                }}
            >
                <h3
                    className="font-medium mb-2"
                    style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--font-size-base)",
                    }}
                >
                    How it works
                </h3>
                <p
                    className="text-sm max-w-lg mx-auto"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    Voting is anonymous but protected by fingerprinting. Each
                    user can only vote once per option. Rankings update
                    automatically based on total votes.
                </p>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: debate.options.map(
                            (opt: any, index: number) => ({
                                "@type": "ListItem",
                                position: index + 1,
                                name: opt.name,
                                voteCount: opt.votes,
                            })
                        ),
                        name: debate.title,
                        description: debate.description,
                    }),
                }}
            />
        </div>
    );
}
