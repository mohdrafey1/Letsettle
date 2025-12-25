import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: "var(--color-base-bg)",
                borderTop: "1px solid var(--color-base-border)",
            }}
            className="py-12 px-6 mt-auto"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="col-span-1 md:col-span-1">
                    <h3
                        className="font-bold text-lg mb-4"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Letsettle
                    </h3>
                    <p
                        className="text-sm mb-4 leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        The public voting platform where opinions turn into
                        data. Settle debates with transparency.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://x.com/mohdrafey72"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-tertiary)" }}
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="https://github.com/mohdrafey1"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-tertiary)" }}
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/mohd-rafey"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-tertiary)" }}
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                {/* Links - Product */}
                <div>
                    <h4
                        className="font-medium mb-4"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Product
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/all-debates"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Browse Debates
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/categories"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/create"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Start a Debate
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/how-it-works"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                How It Works
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Links - Company */}
                <div>
                    <h4
                        className="font-medium mb-4"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Company
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/about"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/privacy-policy"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/terms-of-service"
                                className="hover:underline"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal / Copyright */}
                <div className="md:col-span-4 pt-8 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p style={{ color: "var(--color-text-tertiary)" }}>
                        &copy; {new Date().getFullYear()} Letsettle. All rights
                        reserved.
                    </p>
                    <p style={{ color: "var(--color-text-tertiary)" }}>
                        Made with ❤️ by Mohd Rafey
                    </p>
                </div>
            </div>
        </footer>
    );
}
