"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFingerprint } from "@/lib/hooks/useFingerprint";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoteButtonProps {
    debateId: string;
    optionId: string;
    optionName: string;
    initialVotes: number;
    totalVotes: number;
    index?: number; // Optional index for numbering
}

const COLORS = [
    {
        name: "teal",
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        bar: "bg-teal-100/50",
        hover: "hover:border-teal-500",
        activeBorder: "border-teal-500",
    },
    {
        name: "amber",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        bar: "bg-amber-100/50",
        hover: "hover:border-amber-500",
        activeBorder: "border-amber-500",
    },
    {
        name: "rose",
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        bar: "bg-rose-100/50",
        hover: "hover:border-rose-500",
        activeBorder: "border-rose-500",
    },
    {
        name: "indigo",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        bar: "bg-indigo-100/50",
        hover: "hover:border-indigo-500",
        activeBorder: "border-indigo-500",
    },
];

export default function VoteButton({
    debateId,
    optionId,
    optionName,
    initialVotes,
    totalVotes,
    index = 0,
}: VoteButtonProps) {
    const router = useRouter();
    const fingerprintId = useFingerprint();

    const [votes, setVotes] = useState(initialVotes);
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [isThisOptionVoted, setIsThisOptionVoted] = useState(false);

    // Derive color theme based on index
    const theme = COLORS[index % COLORS.length];

    // Sync votes state when initialVotes prop changes (after router.refresh)
    useEffect(() => {
        setVotes(initialVotes);
    }, [initialVotes]);

    // Check localStorage on mount to see if user has voted for this debate
    useEffect(() => {
        const checkVoteStatus = () => {
            const votedOptionId = localStorage.getItem(`vote_${debateId}`);
            if (votedOptionId) {
                setHasVoted(true);
                if (votedOptionId === optionId) {
                    setIsThisOptionVoted(true);
                } else {
                    // This option is NOT the voted one, reset state
                    setIsThisOptionVoted(false);
                }
            } else {
                setHasVoted(false);
                setIsThisOptionVoted(false);
            }
        };

        // Check on mount
        checkVoteStatus();

        // Listen for vote events from other VoteButton components
        const handleVoteEvent = (event: CustomEvent) => {
            if (event.detail.debateId === debateId) {
                checkVoteStatus();
            }
        };

        window.addEventListener(
            "voteRecorded",
            handleVoteEvent as EventListener
        );

        return () => {
            window.removeEventListener(
                "voteRecorded",
                handleVoteEvent as EventListener
            );
        };
    }, [debateId, optionId]);

    const percentage =
        totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();

        // If loading, don't allow action
        if (isLoading || !fingerprintId) return;

        // If already voted for THIS specific option, don't allow re-voting
        if (isThisOptionVoted) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ debateId, optionId, fingerprintId }),
            });

            const data = await res.json();

            if (res.ok) {
                const isVoteChange = data.isChange;

                if (isVoteChange) {
                    // Vote was changed from another option
                    // Don't increment locally - let router.refresh() update from server
                    toast.success("Vote changed successfully!");
                } else {
                    // New vote - safe to increment locally
                    if (data.message) {
                        // Clicked same option - already voted
                        return;
                    }
                    setVotes((prev) => prev + 1);
                    toast.success("Vote recorded");
                }

                setHasVoted(true);
                setIsThisOptionVoted(true);

                // Store voted option in localStorage
                localStorage.setItem(`vote_${debateId}`, optionId);

                // Notify all other VoteButton components to update
                window.dispatchEvent(
                    new CustomEvent("voteRecorded", {
                        detail: { debateId, optionId },
                    })
                );

                router.refresh();
            } else {
                toast.error(data.error || "Failed to record vote");
            }
        } catch (error) {
            console.error("Vote failed", error);
            toast.error("Failed to record vote");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleVote}
            disabled={isLoading || isThisOptionVoted}
            className={cn(
                "group relative flex items-center justify-between w-full p-4 transition-all rounded-lg border text-left overflow-hidden",
                hasVoted
                    ? isThisOptionVoted
                        ? `border-2 ${theme.activeBorder} ${theme.bg} shadow-sm`
                        : "border-transparent bg-stone-50"
                    : `bg-white border-stone-200 ${theme.hover} hover:shadow-sm`
            )}
        >
            {/* Progress Bar - Only Show After Voting */}
            {hasVoted && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`absolute left-0 top-0 bottom-0 ${theme.bar}`}
                />
            )}

            <div className="flex items-center gap-3 relative z-10 w-full">
                {/* Option Number */}
                {index !== undefined && (
                    <div className="font-mono-numbers font-bold w-6 text-stone-400 text-sm">
                        #{index + 1}
                    </div>
                )}

                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <span
                            className={`font-medium transition-colors ${
                                hasVoted
                                    ? "text-stone-700"
                                    : "text-stone-700 group-hover:text-stone-900"
                            }`}
                        >
                            {optionName}
                        </span>
                    </div>

                    {/* Vote Count and Percentage */}
                    {hasVoted && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2"
                        ></motion.div>
                    )}
                </div>
            </div>

            {/* Vote Count and Percentage - Only Show After Voting */}
            {hasVoted && (
                <div className="flex flex-col items-end relative z-10 gap-0.5">
                    <span
                        className="font-mono-numbers font-medium"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "var(--font-size-base)",
                        }}
                    >
                        {votes}
                    </span>
                    <span
                        className="font-mono-numbers text-xs font-medium"
                        style={{
                            color: isThisOptionVoted
                                ? "var(--color-accent)"
                                : "var(--color-text-tertiary)",
                        }}
                    >
                        {percentage}%
                    </span>
                </div>
            )}
        </button>
    );
}
