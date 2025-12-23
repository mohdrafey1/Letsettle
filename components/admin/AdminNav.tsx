"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Clock, List, Settings, LogOut } from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pending Debates", href: "/admin/pending", icon: Clock },
    { label: "All Debates", href: "/admin/debates", icon: List },
    { label: "Options", href: "/admin/options", icon: Settings },
];

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/");
    };

    return (
        <nav className="w-64 bg-gray-900 text-white min-h-screen p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-gray-400 text-sm">Letsettle</p>
            </div>

            <ul className="space-y-2">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 mt-8 w-full transition-colors"
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </nav>
    );
}
