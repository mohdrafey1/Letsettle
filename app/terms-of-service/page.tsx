"use client";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)] py-20 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-[var(--color-base-border)] shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Terms of Service
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-10">
                    Last updated: December 25, 2025
                </p>

                <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using Letsettle, you agree to be
                            bound by these Terms of Service and all applicable
                            laws and regulations. If you do not agree with any
                            of these terms, you are prohibited from using or
                            accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            2. Use License
                        </h2>
                        <p>
                            Permission is granted to temporarily download one
                            copy of the materials (information or software) on
                            Letsettle's website for personal, non-commercial
                            transitory viewing only. This is the grant of a
                            license, not a transfer of title.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            3. User Conduct
                        </h2>
                        <p>You agree not to use the platform to:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>Engage in any unlawful activity or purpose.</li>
                            <li>
                                Attempt to manipulate voting results through
                                automated means, bots, or scripts.
                            </li>
                            <li>
                                Harass, abuse, or harm another person or group.
                            </li>
                            <li>
                                Post content that is hate speech, threatening,
                                or pornographic.
                            </li>
                        </ul>
                        <p className="mt-4">
                            We reserve the right to remove any content or debate
                            that violates these terms or for any other reason at
                            our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            4. Disclaimer
                        </h2>
                        <p>
                            The materials on Letsettle's website are provided on
                            an 'as is' basis. Letsettle makes no warranties,
                            expressed or implied, and hereby disclaims and
                            negates all other warranties including, without
                            limitation, implied warranties or conditions of
                            merchantability, fitness for a particular purpose,
                            or non-infringement of intellectual property or
                            other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            5. Governing Law
                        </h2>
                        <p>
                            These terms and conditions are governed by and
                            construed in accordance with the laws of the
                            jurisdiction in which Letsettle operates and you
                            irrevocably submit to the exclusive jurisdiction of
                            the courts in that State or location.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
