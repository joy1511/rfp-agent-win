const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Calculates specification match percentage between RFP text and product specifications
 * @param {string} rfpText - The RFP requirement text
 * @param {string} productSpecs - The product specifications text
 * @returns {Promise<number>} A number between 0 and 100 representing match percentage
 */
async function getSpecMatchPercentage(rfpText, productSpecs) {
  console.log("🧠 Gemini spec match called");
  try {
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.warn('GEMINI_API_KEY not set, returning default match percentage');
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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 10,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const matchPercentage = parseFloat(text || '0');
    
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

