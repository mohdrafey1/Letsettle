import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDebate extends Document {
    slug: string;
    title: string;
    description?: string;
    category: string;
    subCategory?: string;
    totalVotes: number;
    isActive: boolean;
    isMoreOptionAllowed: boolean;
    status: "pending" | "approved" | "rejected";
    createdBy?: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
}

const DebateSchema: Schema = new Schema(
    {
        slug: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true, maxlength: 150 },
        description: { type: String, maxlength: 500 },
        category: { type: String, required: true, index: true },
        subCategory: { type: String, index: true },
        totalVotes: { type: Number, default: 0, index: true },
        isActive: { type: Boolean, default: true },
        isMoreOptionAllowed: { type: Boolean, default: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
        createdBy: { type: String },
        rejectionReason: { type: String },
        tags: { type: [String], index: true },
    },
    { timestamps: true }
);

// Compound indexes for common query patterns
DebateSchema.index({ category: 1, totalVotes: -1 }); // Category page with sorting
DebateSchema.index({ isActive: 1, totalVotes: -1 }); // Homepage trending debates
DebateSchema.index({ isActive: 1, createdAt: -1 }); // Recent active debates
DebateSchema.index({ category: 1, createdAt: -1 }); // Recent debates by category
DebateSchema.index({ isActive: 1, category: 1, totalVotes: -1 }); // Category filtering with trending
DebateSchema.index({ status: 1, createdAt: -1 }); // Admin pending queue
DebateSchema.index({ status: 1, isActive: 1, totalVotes: -1 }); // Approved active debates

// Prevent compiling model multiple times in development
const Debate: Model<IDebate> =
    mongoose.models.Debate || mongoose.model<IDebate>("Debate", DebateSchema);

export default Debate;
