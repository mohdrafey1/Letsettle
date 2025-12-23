"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        setIsAdmin(!!token);
    }, []);

    return (
        <nav
            className="w-full border-b bg-white sticky top-0 z-50"
            style={{ borderColor: "var(--color-base-border)" }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 hover-subtle transition-opacity"
                >
                    <Image
                        src="/apple-touch-icon.png"
                        alt="Letsettle Logo"
                        width={32}
                        height={32}
                        className="rounded"
                    />
                    <span
                        className="text-xl font-medium tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Letsettle
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/all-debates"
                        className="text-sm font-medium hover-subtle transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        All Debates
                    </Link>
                    <Link
                        href="/categories"
                        className="text-sm font-medium hover-subtle transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        Categories
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="text-sm font-medium hover-subtle transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        How It Works
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="text-sm font-medium hover-subtle transition-opacity flex items-center gap-1"
                            style={{ color: "var(--color-accent)" }}
                        >
                            <Shield size={16} />
                            Admin
                        </Link>
                    )}
                    <Link
                        href="/create"
                        className="text-sm font-medium px-4 py-2 border transition-all hover:opacity-70"
                        style={{
                            color: "var(--color-accent)",
                            borderColor: "var(--color-accent)",
                            borderRadius: "var(--radius-sm)",
                        }}
                    >
                        Start Debate
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 hover:opacity-70 transition-opacity"
                    style={{ color: "var(--color-text-primary)" }}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden border-t"
                    style={{
                        borderColor: "var(--color-base-border)",
                        backgroundColor: "var(--color-base-surface)",
                    }}
                >
                    <div className="px-6 py-4 space-y-4">
                        <Link
                            href="/all-debates"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            All Debates
                        </Link>
                        <Link
                            href="/categories"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Categories
                        </Link>
                        <Link
                            href="/how-it-works"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            How It Works
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2 text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
                                style={{ color: "var(--color-accent)" }}
                            >
                                <Shield size={16} />
                                Admin Panel
                            </Link>
                        )}
                        <Link
                            href="/create"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-3 text-sm font-medium text-center border transition-all hover:opacity-70"
                            style={{
                                color: "var(--color-accent)",
                                borderColor: "var(--color-accent)",
                                borderRadius: "var(--radius-sm)",
                            }}
                        >
                            Start Debate
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
