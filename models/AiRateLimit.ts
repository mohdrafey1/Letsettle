import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAiRateLimit extends Document {
    ip: string;
    count: number;
    date: string; // YYYY-MM-DD
    lastRequest: Date;
}

const AiRateLimitSchema = new Schema<IAiRateLimit>(
    {
        ip: { type: String, required: true, index: true },
        count: { type: Number, default: 1 },
        date: { type: String, required: true }, // Store as string to easily group by day
        lastRequest: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Compound index to ensure unique record per IP per Day
AiRateLimitSchema.index({ ip: 1, date: 1 }, { unique: true });

const AiRateLimit: Model<IAiRateLimit> =
    mongoose.models.AiRateLimit ||
    mongoose.model<IAiRateLimit>("AiRateLimit", AiRateLimitSchema);

export default AiRateLimit;
