import {
    Trophy,
    Cpu,
    Landmark,
    Film,
    Tv,
    Music,
    Gamepad2,
    UtensilsCrossed,
    Plane,
    Microscope,
    BookOpen,
    Lightbulb,
    Palette,
    BookMarked,
    Shirt,
    TrendingUp,
    Briefcase,
    Heart,
    Dumbbell,
    GraduationCap,
    BriefcaseBusiness,
    Users,
    Baby,
    PawPrint,
    Car,
    Leaf,
    Rocket,
    Bitcoin,
    Bot,
    Share2,
    LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
    name: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
    {
        name: "AI",
        icon: Bot,
        color: "#7C3AED",
        bgColor: "#EDE9FE",
    },
    {
        name: "Art",
        icon: Palette,
        color: "#EC4899",
        bgColor: "#FCE7F3",
    },
    {
        name: "Automotive",
        icon: Car,
        color: "#6B7280",
        bgColor: "#F3F4F6",
    },
    {
        name: "Business",
        icon: Briefcase,
        color: "#0D7C7C",
        bgColor: "#E0F2F2",
    },
    {
        name: "Career",
        icon: BriefcaseBusiness,
        color: "#0891B2",
        bgColor: "#CFFAFE",
    },
    {
        name: "Crypto",
        icon: Bitcoin,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
    },
    {
        name: "Education",
        icon: GraduationCap,
        color: "#3B82F6",
        bgColor: "#DBEAFE",
    },
    {
        name: "Entertainment",
        icon: Film,
        color: "#7C3AED",
        bgColor: "#EDE9FE",
    },
    {
        name: "Fashion",
        icon: Shirt,
        color: "#EC4899",
        bgColor: "#FCE7F3",
    },
    {
        name: "Finance",
        icon: TrendingUp,
        color: "#10B981",
        bgColor: "#D1FAE5",
    },
    {
        name: "Fitness",
        icon: Dumbbell,
        color: "#EF4444",
        bgColor: "#FEE2E2",
    },
    {
        name: "Food",
        icon: UtensilsCrossed,
        color: "#F97316",
        bgColor: "#FFEDD5",
    },
    {
        name: "Gaming",
        icon: Gamepad2,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
    },
    {
        name: "Health",
        icon: Heart,
        color: "#EF4444",
        bgColor: "#FEE2E2",
    },
    {
        name: "History",
        icon: BookOpen,
        color: "#92400E",
        bgColor: "#FEF3C7",
    },
    {
        name: "Literature",
        icon: BookMarked,
        color: "#6366F1",
        bgColor: "#E0E7FF",
    },
    {
        name: "Movies",
        icon: Film,
        color: "#DC2626",
        bgColor: "#FEE2E2",
    },
    {
        name: "Music",
        icon: Music,
        color: "#EC4899",
        bgColor: "#FCE7F3",
    },
    {
        name: "Nature",
        icon: Leaf,
        color: "#10B981",
        bgColor: "#D1FAE5",
    },
    {
        name: "Parenting",
        icon: Baby,
        color: "#F472B6",
        bgColor: "#FCE7F3",
    },
    {
        name: "Pets",
        icon: PawPrint,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
    },
    {
        name: "Philosophy",
        icon: Lightbulb,
        color: "#FBBF24",
        bgColor: "#FEF3C7",
    },
    {
        name: "Politics",
        icon: Landmark,
        color: "#DC2626",
        bgColor: "#FEE2E2",
    },
    {
        name: "Relationships",
        icon: Users,
        color: "#EC4899",
        bgColor: "#FCE7F3",
    },
    {
        name: "Science",
        icon: Microscope,
        color: "#0D7C7C",
        bgColor: "#E0F2F2",
    },
    {
        name: "Social Media",
        icon: Share2,
        color: "#3B82F6",
        bgColor: "#DBEAFE",
    },
    {
        name: "Space",
        icon: Rocket,
        color: "#6366F1",
        bgColor: "#E0E7FF",
    },
    {
        name: "Sports",
        icon: Trophy,
        color: "#F59E0B",
        bgColor: "#FEF3C7",
    },
    {
        name: "TV Shows",
        icon: Tv,
        color: "#8B5CF6",
        bgColor: "#EDE9FE",
    },
    {
        name: "Technology",
        icon: Cpu,
        color: "#0D7C7C",
        bgColor: "#E0F2F2",
    },
    {
        name: "Travel",
        icon: Plane,
        color: "#06B6D4",
        bgColor: "#CFFAFE",
    },
];

// Helper function to get category config by name
export function getCategoryConfig(
    categoryName: string
): CategoryConfig | undefined {
    return CATEGORY_CONFIGS.find(
        (config) => config.name.toLowerCase() === categoryName.toLowerCase()
    );
}

// Get only the featured categories for the homepage
export function getFeaturedCategories(): CategoryConfig[] {
    const featured = ["Sports", "Technology", "Politics", "Entertainment"];
    return CATEGORY_CONFIGS.filter((config) => featured.includes(config.name));
}
