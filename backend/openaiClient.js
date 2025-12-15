const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ---------- MOCK MODE HELPERS ----------

// Simple keyword extractor for mock mode
function extractKeywords(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((word) => word.length > 3);
}

// Deterministic-ish score between 80 and 98 based on keyword overlap
function computeMockScore(rfpText, productSpecs) {
  const rfpWords = extractKeywords(rfpText);
  const specWords = new Set(extractKeywords(productSpecs));

  if (!rfpWords.length || !specWords.size) {
    return 85; // Safe middle-ground default
  }

  let matches = 0;
  rfpWords.forEach((w) => {
    if (specWords.has(w)) matches += 1;
  });

  const overlapRatio = matches / rfpWords.length; // 0..1
  const base = 80 + Math.min(15, Math.floor(overlapRatio * 100) * 0.15);
  const variation = Math.random() * 4 - 2; // -2..+2
  const score = Math.max(80, Math.min(98, Math.round(base + variation)));

  return score;
}

// ---------- REAL MODE (OPENAI) ----------

async function callOpenAIForScore(rfpText, productSpecs) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OPENAI_API_KEY not set, falling back to mock score");
    return null;
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

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a technical evaluation expert. Respond with only a number between 0 and 100.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 10,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`OpenAI API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || "0";
  const numeric = parseFloat(content || "0");

  if (Number.isNaN(numeric)) {
    throw new Error(`OpenAI returned non-numeric response: "${content}"`);
  }

  return numeric;
}

/**
 * Calculates specification match percentage between RFP text and product specifications
 * @param {string} rfpText - The RFP requirement text
 * @param {string} productSpecs - The product specifications text
 * @returns {Promise<number>} A number between 0 and 100 representing match percentage
 */
async function getSpecMatchPercentage(rfpText, productSpecs) {
  const mode = (process.env.AI_MODE || "MOCK").toUpperCase();

  // MOCK mode: fast, deterministic-ish, no external calls
  if (mode === "MOCK") {
    console.log("🧠 AI MOCK spec match used");
    return computeMockScore(rfpText, productSpecs);
  }

  // REAL mode: call OpenAI, with mock fallback
  console.log("🧠 OpenAI spec match called");
  try {
    const rawScore = await callOpenAIForScore(rfpText, productSpecs);

    if (rawScore == null) {
      // Missing API key or similar – fall back to mock score
      return computeMockScore(rfpText, productSpecs);
    }

    const clamped = Math.max(0, Math.min(100, rawScore));
    return Math.round(clamped);
  } catch (error) {
    console.error("Error calculating spec match percentage via OpenAI, using mock fallback:", error);
    return computeMockScore(rfpText, productSpecs);
  }
}

module.exports = {
  getSpecMatchPercentage,
};

