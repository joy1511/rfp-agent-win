const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calculates specification match percentage between RFP text and product specifications
 * @param {string} rfpText - The RFP requirement text
 * @param {string} productSpecs - The product specifications text
 * @returns {Promise<number>} A number between 0 and 100 representing match percentage
 */
async function getSpecMatchPercentage(rfpText, productSpecs) {
  console.log("🧠 OpenAI SPEC MATCH CALLED");
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set, returning default match percentage');
      return 85; // Default fallback value
    }

    const prompt = `You are an expert technical evaluator. Analyze the match between an RFP requirement and a product specification.

RFP Requirement:
${rfpText}

Product Specification:
${productSpecs}

Evaluate how well the product specification matches the RFP requirement. Consider:
- Technical compatibility
- Feature alignment
- Performance requirements
- Compliance and standards
- Overall fit

Respond with ONLY a single number between 0 and 100 representing the match percentage. Do not include any explanation, just the number.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a technical evaluation expert. Respond with only a number between 0 and 100.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const matchPercentage = parseFloat(response.choices[0]?.message?.content?.trim() || '0');
    
    // Ensure the result is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, matchPercentage));
    
    return Math.round(clampedPercentage);
  } catch (error) {
    console.error('Error calculating spec match percentage:', error);
    // Return a default value on error
    return 85;
  }
}

module.exports = {
  getSpecMatchPercentage,
};

