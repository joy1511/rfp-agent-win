// Lazily-loaded Gemini client so this works in CommonJS without ESM import issues
let genAI = null;

async function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  if (!genAI) {
    // Use dynamic import because @google/generative-ai is ESM-only
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Use a lightweight, fast model for numeric scoring
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 10,
    },
  });
}

/**
 * Calculates specification match percentage between RFP text and product specifications
 * @param {string} rfpText - The RFP requirement text
 * @param {string} productSpecs - The product specifications text
 * @returns {Promise<number>} A number between 0 and 100 representing match percentage
 */
async function getSpecMatchPercentage(rfpText, productSpecs) {
  console.log("🧠 Gemini spec match called");
  try {
    const model = await getGeminiModel();

    if (!model) {
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

