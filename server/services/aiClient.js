const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'openai/gpt-5';

if (!OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY not set. AI calls will fail until you set it.');
}

console.log("OPENROUTER_API_KEY value:", OPENROUTER_API_KEY);

async function extractMenuAsJson(fileText) {
  const systemPrompt = `
You are an AI assistant that extracts food menus from messy text.
Respond ONLY with JSON. No explanations, no markdown, no extra text.
The JSON must strictly follow this schema:

{
  "title": string|null,
  "day_of_week": string|null,
  "menu_items": [
    {
      "name": string,
      "description": string|null,
      "price": string|null,
      "category": string|null
    }
  ],
  "special_notes": string|null
}

Use null or empty arrays if fields are missing.
`;

  const userPrompt = `
Extract the "Home Chef" menu from the text below.
Respond STRICTLY with JSON only, following the schema above.
Ignore any unrelated text.

--- BEGIN TEXT ---
${fileText}
--- END TEXT ---
`;

  try {
    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let assistantMessage = resp.data.choices[0].message.content.trim();

    // Attempt to extract JSON from the response
    let parsed;
    try {
      parsed = JSON.parse(assistantMessage);
    } catch (err) {
      // Fallback: grab first {...} block
      const match = assistantMessage.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error('Full AI response:', assistantMessage);
        throw new Error('Model did not return valid JSON');
      }
      parsed = JSON.parse(match[0]);
    }

    // Ensure schema compliance
    return {
      title: parsed.title || null,
      day_of_week: parsed.day_of_week || null,
      menu_items: Array.isArray(parsed.menu_items)
        ? parsed.menu_items.map(item => ({
            name: item.name || '',
            description: item.description || null,
            price: item.price || null,
            category: item.category || null,
          }))
        : [],
      special_notes: parsed.special_notes || null,
    };
  } catch (err) {
    console.error('AI call failed:', err?.response?.data || err.message);
    throw err;
  }
}

module.exports = { extractMenuAsJson };
