import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOptionRateLimit extends Document {
    ip: string;
    count: number;
    date: string; // YYYY-MM-DD
    lastRequest: Date;
}

const OptionRateLimitSchema = new Schema<IOptionRateLimit>(
    {
        ip: { type: String, required: true, index: true },
        count: { type: Number, default: 1 },
        date: { type: String, required: true }, // Store as string to easily group by day
        lastRequest: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Compound index to ensure unique record per IP per Day
OptionRateLimitSchema.index({ ip: 1, date: 1 }, { unique: true });

const OptionRateLimit: Model<IOptionRateLimit> =
    mongoose.models.OptionRateLimit ||
    mongoose.model<IOptionRateLimit>("OptionRateLimit", OptionRateLimitSchema);

export default OptionRateLimit;
