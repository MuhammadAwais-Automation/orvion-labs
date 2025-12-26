/**
 * Model Pricing Configuration
 * Defines token multipliers and cost calculation for the credit system
 */

/**
 * Token multiplier rates for each AI model
 * Base rate (1x) is gpt-4o-mini
 */
export const MODEL_RATES: Record<string, number> = {
    'gpt-4o-mini': 1,        // Base rate
    'gpt-3.5-turbo': 2,      // 2x cost
    'gpt-4o': 20,            // Premium rate (20x)
    'gpt-4-turbo': 20,       // Premium rate (20x)
}

/**
 * Calculate credit cost based on model and token usage
 * 
 * @param modelName - The AI model name (e.g., 'gpt-4o-mini')
 * @param totalTokens - Total tokens used in the request
 * @returns Credit cost (minimum 1 credit)
 * 
 * @example
 * calculateCost('gpt-4o-mini', 500) // Returns 1 (0.5 * 1, ceil'd, min 1)
 * calculateCost('gpt-4o', 5000) // Returns 100 (5 * 20)
 */
export function calculateCost(modelName: string, totalTokens: number): number {
    // Get multiplier for the model, default to 5 if not found
    const multiplier = MODEL_RATES[modelName] ?? 5

    // Calculate cost: (tokens / 1000) * multiplier, rounded up
    const cost = Math.ceil((totalTokens / 1000) * multiplier)

    // Ensure minimum cost is 1 credit
    return Math.max(cost, 1)
}
