"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h4 className="text-[var(--color-accent)] font-medium tracking-wide uppercase text-sm mb-4">
                            Our Mission
                        </h4>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            Settle Debates with
                            <br />
                            <span className="text-[var(--color-text-secondary)]">
                                Transparency & Data
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10">
                            Letsettle is the public voting platform where
                            opinions turn into actionable data. We believe in
                            the power of collective decision-making, stripped of
                            noise and bias.
                        </p>
                    </motion.div>
                </div>

                {/* Background Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent-light)] opacity-20 blur-3xl rounded-full -z-0 pointer-events-none" />
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-white border-y border-[var(--color-base-border)] px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={
                                <Users className="w-8 h-8 text-[var(--color-accent)]" />
                            }
                            title="Community Driven"
                            description="Every debate is started, voted on, and settled by real people. Your voice shapes the consensus."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={
                                <Shield className="w-8 h-8 text-[var(--color-accent)]" />
                            }
                            title="Transparent & Fair"
                            description="No hidden algorithms. Just raw votes and clear visual data. See exactly where the public stands."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={
                                <CheckCircle2 className="w-8 h-8 text-[var(--color-accent)]" />
                            }
                            title="Decisive Results"
                            description="Move beyond endless arguments. Get a definitive answer backed by numbers and close the case."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Story / Context Section */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Why Letsettle?
                        </h2>
                        <div className="space-y-6 text-lg text-[var(--color-text-secondary)] leading-relaxed">
                            <p>
                                In a world full of noise, it's hard to know what
                                people really think. Social media comments are
                                messy, and specialized forums are often echo
                                chambers.
                            </p>
                            <p>
                                <strong className="text-[var(--color-text-primary)]">
                                    Letsettle
                                </strong>{" "}
                                was built to cut through that noise. We provide
                                a clean, neutral ground for settling arguments,
                                validating ideas, or simply satisfying
                                curiosity. Whether it's a serious policy debate
                                or a lighthearted preference check, we give you
                                the tools to measure public opinion accurately.
                            </p>
                            <p>
                                We prioritize simplicity and clarity. No
                                clutter, no distractions—just the question and
                                the data.
                            </p>
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-text-primary)] text-white font-medium rounded-lg hover:bg-black/90 transition-colors"
                            >
                                Start a Debate
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="flex flex-col items-center text-center p-6"
        >
            <div className="mb-6 p-4 bg-[var(--color-base-bg)] rounded-2xl border border-[var(--color-base-border)]">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
