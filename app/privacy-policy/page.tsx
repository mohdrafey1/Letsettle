"use client";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)] py-20 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-[var(--color-base-border)] shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Privacy Policy
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-10">
                    Last updated: December 25, 2025
                </p>

                <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            1. Introduction
                        </h2>
                        <p>
                            Welcome to Letsettle. We respect your privacy and
                            are committed to protecting your personal data. This
                            privacy policy will inform you as to how we look
                            after your personal data when you visit our website
                            directly or vote on our platform, and tell you about
                            your privacy rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            2. Data We Collect
                        </h2>
                        <p>
                            We collect minimal data necessary to operate the
                            platform and ensure fair voting. This may include:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>
                                <strong>Usage Data:</strong> Information about
                                how you use our website, products, and services.
                            </li>
                            <li>
                                <strong>Voting Data:</strong> Your votes are
                                recorded anonymously but linked to session
                                identifiers to prevent double-voting.
                            </li>
                            <li>
                                <strong>Technical Data:</strong> Internet
                                protocol (IP) address, browser type and version,
                                time zone setting and location, and operating
                                system.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            3. How We Use Your Data
                        </h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>
                                Ensure the integrity of the voting process
                                (preventing spam or manipulation).
                            </li>
                            <li>
                                Analyze trends and usage to improve our
                                platform.
                            </li>
                            <li>Display aggregated voting results publicly.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            4. Cookies and Tracking
                        </h2>
                        <p>
                            We use cookies and similar technologies to track the
                            activity on our service and hold certain
                            information. You can instruct your browser to refuse
                            all cookies or to indicate when a cookie is being
                            sent. However, if you do not accept cookies, you may
                            not be able to use some portions of our service
                            (such as voting).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                            5. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy,
                            please contact us via the contact methods available
                            on our website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
