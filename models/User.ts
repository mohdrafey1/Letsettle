import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    role: "admin";
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "admin", enum: ["admin"] },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
