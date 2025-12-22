import Link from "next/link";
import VoteButton from "./VoteButton";
import ShareButton from "./ShareButton";
import { Debate } from "@/lib/types";

export default function DebateCard({ debate }: { debate: Debate }) {
    const d = debate;
    const isTrending = d.totalVotes > 200;

    return (
        <div
            className="p-6 transition-all hover-accent-border"
            style={{
                backgroundColor: "var(--color-base-surface)",
                border: "1px solid var(--color-base-border)",
                borderRadius: "var(--radius-sm)",
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div
                        className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide mb-1"
                        style={{ color: "var(--color-text-tertiary)" }}
                    >
                        <Link
                            href={`/category/${d.category}`}
                            className="hover:underline hover:text-blue-600"
                        >
                            {d.category}
                        </Link>
                        {d.subCategory && (
                            <>
                                <span>·</span>
                                <Link
                                    href={`/category/${d.category}/${d.subCategory}`}
                                    className="hover:underline hover:text-blue-600"
                                >
                                    {d.subCategory}
                                </Link>
                            </>
                        )}
                        {isTrending && (
                            <>
                                <span>·</span>
                                <span
                                    className="flex items-center gap-1"
                                    style={{ color: "var(--color-accent)" }}
                                >
                                    🔥
                                    <span className="hidden lg:inline">
                                        {" "}
                                        Trending
                                    </span>
                                </span>
                            </>
                        )}
                    </div>

                    <div
                        className="text-sm font-mono-numbers"
                        style={{ color: "var(--color-text-tertiary)" }}
                    >
                        {d.totalVotes} votes
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ShareButton title={d.title} slug={d.slug} />
                </div>
            </div>

            <Link href={`/debate/${d.slug}`} className="block group mb-6">
                <div className="flex items-start gap-2">
                    <h3
                        className="flex-1 font-medium leading-tight transition-all"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "var(--font-size-xl)",
                        }}
                    >
                        <span className="group-hover:underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]">
                            {d.title}
                        </span>
                    </h3>
                    {/* Arrow indicator that appears on hover */}
                    <svg
                        className="w-5 h-5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        style={{ color: "var(--color-accent)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </Link>

            <div className="space-y-3">
                {d.options.slice(0, 3).map((opt, idx) => (
                    <VoteButton
                        key={opt._id.toString()}
                        debateId={d._id.toString()}
                        optionId={opt._id.toString()}
                        optionName={opt.name}
                        initialVotes={opt.votes}
                        totalVotes={d.totalVotes}
                        index={idx}
                    />
                ))}
            </div>

            {d.options.length > 3 && (
                <div className="mt-4 text-center">
                    <Link
                        href={`/debate/${d.slug}`}
                        className="text-sm font-medium hover-subtle transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        + {d.options.length - 3} more
                    </Link>
                </div>
            )}

            {/* View Full Debate Button */}
            <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid var(--color-base-border)" }}
            >
                <Link
                    href={`/debate/${d.slug}`}
                    className="flex items-center justify-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 group/btn"
                    style={{ color: "var(--color-accent)" }}
                >
                    <span>View Full Debate</span>
                    <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
