"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Clock,
    List,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pending Debates", href: "/admin/pending", icon: Clock },
    { label: "All Debates", href: "/admin/debates", icon: List },
    { label: "Options", href: "/admin/options", icon: Settings },
];

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/");
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold">Admin Panel</h1>
                        <p className="text-gray-400 text-xs">Letsettle</p>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar Navigation */}
            <nav
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
                    transform transition-transform duration-300 ease-in-out
                    ${
                        isMobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                    flex flex-col
                `}
            >
                <div className="p-6 flex-shrink-0">
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Letsettle</p>
                    </div>
                    {/* Mobile header spacing */}
                    <div className="lg:hidden h-4"></div>
                </div>

                <div className="flex-1 px-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                                                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 w-full transition-all duration-200 group"
                    >
                        <LogOut
                            size={20}
                            className="group-hover:rotate-12 transition-transform"
                        />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
