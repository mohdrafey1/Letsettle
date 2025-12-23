// Validation utilities for content moderation

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

// Check if text is mostly uppercase (more than 50%)
export function hasExcessiveCaps(text: string): boolean {
    const letters = text.replace(/[^a-zA-Z]/g, "");
    if (letters.length === 0) return false;

    const upperCount = text.replace(/[^A-Z]/g, "").length;
    return upperCount / letters.length > 0.5;
}

// Check if text is only emojis/symbols (no alphanumeric chars)
export function isEmojiOnly(text: string): boolean {
    const alphanumeric = text.replace(/[^a-zA-Z0-9]/g, "");
    return alphanumeric.length === 0;
}

// Detect common spam patterns
export function detectSpamPatterns(text: string): boolean {
    const lowerText = text.toLowerCase();

    // Common spam indicators
    const spamPatterns = [
        /(.)\1{5,}/, // Same character repeated 5+ times
        /https?:\/\//i, // URLs (optional based on your needs)
        /\b(buy now|click here|limited time|act now)\b/i, // Spam phrases
    ];

    return spamPatterns.some((pattern) => pattern.test(lowerText));
}

// Validate debate title
export function validateDebateTitle(title: string): ValidationResult {
    if (!title || title.trim().length === 0) {
        return { valid: false, error: "Title is required" };
    }

    const trimmed = title.trim();

    if (trimmed.length < 10) {
        return {
            valid: false,
            error: "Title must be at least 10 characters long",
        };
    }

    if (trimmed.length > 150) {
        return { valid: false, error: "Title must be 150 characters or less" };
    }

    if (isEmojiOnly(trimmed)) {
        return {
            valid: false,
            error: "Title cannot contain only emojis or symbols",
        };
    }

    if (hasExcessiveCaps(trimmed)) {
        return { valid: false, error: "Title has too many capital letters" };
    }

    if (detectSpamPatterns(trimmed)) {
        return { valid: false, error: "Title contains spam patterns" };
    }

    return { valid: true };
}

// Validate debate description
export function validateDebateDescription(
    description: string
): ValidationResult {
    if (!description) {
        return { valid: true }; // Description is optional
    }

    const trimmed = description.trim();

    if (trimmed.length > 500) {
        return {
            valid: false,
            error: "Description must be 500 characters or less",
        };
    }

    if (isEmojiOnly(trimmed)) {
        return {
            valid: false,
            error: "Description cannot contain only emojis or symbols",
        };
    }

    if (detectSpamPatterns(trimmed)) {
        return { valid: false, error: "Description contains spam patterns" };
    }

    return { valid: true };
}

// Validate a single option
export function validateOption(option: string): ValidationResult {
    if (!option || option.trim().length === 0) {
        return { valid: false, error: "Option is required" };
    }

    const trimmed = option.trim();

    if (trimmed.length < 2) {
        return {
            valid: false,
            error: "Option must be at least 2 characters long",
        };
    }

    if (trimmed.length > 50) {
        return { valid: false, error: "Option must be 50 characters or less" };
    }

    if (isEmojiOnly(trimmed)) {
        return {
            valid: false,
            error: "Option cannot contain only emojis or symbols",
        };
    }

    if (hasExcessiveCaps(trimmed)) {
        return { valid: false, error: "Option has too many capital letters" };
    }

    return { valid: true };
}

// Validate all options
export function validateOptions(options: string[]): ValidationResult {
    if (!options || options.length < 2) {
        return { valid: false, error: "At least 2 options are required" };
    }

    for (let i = 0; i < options.length; i++) {
        const result = validateOption(options[i]);
        if (!result.valid) {
            return { valid: false, error: `Option ${i + 1}: ${result.error}` };
        }
    }

    return { valid: true };
}

// Get user identifier from request (IP address for now)
export function getUserIdentifier(request: Request): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    return "unknown";
}
