import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type ModerationStatus = "approved" | "pending";

export interface AnalysisResult {
    status: ModerationStatus;
    tags: string[];
    predictedCategory?: string;
}

export async function analyzeContent(
    title: string,
    description: string = "",
    options: string[] = []
): Promise<AnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set, defaulting to pending status");
        return { status: "pending", tags: [] };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        });

        const prompt = `
            You are a content analyzer for a public debate platform.
            Analyze the following debate topic.

            Input:
            Title: "${title}"
            Description: "${description}"
            Options: ${JSON.stringify(options)}

            Tasks:
            1. Moderation: Classify as SAFE, TOXIC, SPAM, or INAPPROPRIATE.
               - SAFE: Suitable for general public.
               - TOXIC: Hate speech, harassment, violence.
               - SPAM: Nonsense, repetitive, ads.
               - INAPPROPRIATE: NSFW, illegal.
            2. Categorization: Suggest the best fit category for this debate.
            3. Tagging: Generate 3-5 relevant, short tags (lowercase, single words or short phrases).

            Output Format (Strict JSON):
            {
                "moderation": "SAFE" | "TOXIC" | "SPAM" | "INAPPROPRIATE",
                "category": "Technology",
                "tags": ["tag1", "tag2", "tag3"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.error("AI Analysis Raw Response:", text); // using error to ensure visibility

        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Failed to parse AI response");
            return { status: "pending", tags: [] };
        }

        const data = JSON.parse(jsonMatch[0]);
        console.error("AI Analysis Parsed JSON:", data); // using error to ensure visibility

        const status = data.moderation === "SAFE" ? "approved" : "pending";
        const tags = Array.isArray(data.tags)
            ? data.tags.map((t: string) => t.toLowerCase())
            : [];

        return {
            status,
            tags,
            predictedCategory: data.category,
        };
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Fail-safe
        return { status: "pending", tags: [] };
    }
}
export async function analyzeOptionContent(
    debateTitle: string,
    debateDescription: string = "",
    optionName: string
): Promise<{ status: ModerationStatus; reason?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set, defaulting to approved status");
        return { status: "approved" };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
        });

        const prompt = `
            You are a moderator for a public debate platform.
            Review if a user-suggested option is relevant and appropriate for the given debate.

            Debate Topic: "${debateTitle}"
            Debate Description: "${debateDescription}"
            Suggested Option: "${optionName}"

            Tasks:
            1. Relevance: Is the option closely related to the debate topic? (e.g., "Apple" is relevant for "Best Smartphone", "Bananas" is NOT).
            2. Safety: Is it safe (no hate speech, harassment, or profanity)?

            Output Format (Strict JSON):
            {
                "moderation": "SAFE" | "TOXIC" | "IRRELEVANT" | "SPAM",
                "reason": "Brief explanation if rejected"
            }
        `;

        const result = await model.generateContent(prompt);
        const data = JSON.parse(
            result.response.text().match(/\{[\s\S]*\}/)?.[0] || "{}"
        );

        if (data.moderation === "SAFE") {
            return { status: "approved" };
        }

        return {
            status: "pending",
            reason: data.reason || "Option rejected by AI moderator.",
        };
    } catch (error) {
        console.error("Option Analysis Error:", error);
        return { status: "approved" }; // Fail-safe: allow if AI fails
    }
}
