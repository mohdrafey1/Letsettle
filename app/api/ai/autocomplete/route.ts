import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants";
import dbConnect from "@/lib/db";
import AiRateLimit from "@/models/AiRateLimit";
import { headers } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MAX_DAILY_REQUESTS = 3;

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Rate Limiting Logic
        const headersList = headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        if (ip !== "unknown") {
            const rateLimit = await AiRateLimit.findOne({ ip, date: today });

            if (rateLimit) {
                if (rateLimit.count >= MAX_DAILY_REQUESTS) {
                    return NextResponse.json(
                        {
                            error: "Daily limit reached. You can generate 3 debates per day.",
                        },
                        { status: 429 }
                    );
                }
                rateLimit.count += 1;
                rateLimit.lastRequest = new Date();
                await rateLimit.save();
            } else {
                await AiRateLimit.create({
                    ip,
                    date: today,
                    count: 1,
                });
            }
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const systemPrompt = `
            You are a creative debate assistant. Your goal is to take a simple user topic and accept it turn into an engaging, strictly formatted JSON object for a debate platform.
            
            Valid Categories: ${CATEGORIES.join(", ")}

            Instructions:
            1. Title: strict rule : "dont change question" - use the user's input as the title. You may only fix capitalization or add a "?" if missing. Do not rephrase it into a fancy title.
            2. Description: concise, optimal length (approx 2 short sentences). It should provide context but stay brief.
            3. Category: Must be EXACTLY one of the valid categories listed above.
            4. SubCategory: A specific niche (e.g., "Smartphones" for "Technology").
            5. Options: STRICT RULE: Options must be short, precise entities (e.g., "Cats", "Dogs", "Python", "Java"). DO NOT use full sentences or descriptions in the options.

            Output Format (strictly JSON):
            {
                "title": "string",
                "description": "string",
                "category": "string",
                "subCategory": "string",
                "options": ["string", "string"]
            }
        `;

        const result = await model.generateContent([
            systemPrompt,
            `User Topic: ${prompt}`,
        ]);
        const response = result.response;
        const text = response.text();

        // Extract JSON from potential markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse AI response");
        }

        const data = JSON.parse(jsonMatch[0]);

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate debate content" },
            { status: 500 }
        );
    }
}
