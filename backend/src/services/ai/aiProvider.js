/**
 * AI Provider Abstraction Layer
 * Supports Gemini as primary, Groq as secondary, and deterministic rule-based fallback.
 */

class GeminiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = 'Gemini';
  }

  async generateJson(prompt, systemInstruction = '') {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }
    // Make Gemini API call with structured JSON response
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{
        parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('Empty response from Gemini');
    return JSON.parse(candidateText);
  }

  async chat(messages, systemInstruction = '') {
    if (!this.apiKey) throw new Error('Gemini API key not configured');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const formattedContents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const payload = {
      contents: formattedContents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Gemini chat error: ${res.statusText}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }
}

class GroqProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.name = 'Groq';
  }

  async generateJson(prompt, systemInstruction = '') {
    if (!this.apiKey) throw new Error('Groq API key not configured');
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const messages = [
      { role: 'system', content: `${systemInstruction}\nYou MUST output valid JSON only.` },
      { role: 'user', content: prompt }
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.statusText}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  }

  async chat(messages, systemInstruction = '') {
    if (!this.apiKey) throw new Error('Groq API key not configured');
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const formattedMessages = [
      ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
      ...messages
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: formattedMessages
      })
    });

    if (!res.ok) throw new Error(`Groq chat error: ${res.statusText}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}

class AIProviderManager {
  constructor() {
    this.gemini = new GeminiProvider(process.env.GEMINI_API_KEY);
    this.groq = new GroqProvider(process.env.GROQ_API_KEY);
  }

  async generateStructuredOutput(prompt, systemInstruction, fallbackGenerator) {
    // 1. Try Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        return await this.gemini.generateJson(prompt, systemInstruction);
      } catch (err) {
        console.warn(`[AIProvider] Gemini failed: ${err.message}. Trying secondary provider...`);
      }
    }

    // 2. Try Groq
    if (process.env.GROQ_API_KEY) {
      try {
        return await this.groq.generateJson(prompt, systemInstruction);
      } catch (err) {
        console.warn(`[AIProvider] Groq failed: ${err.message}. Falling back to deterministic engine...`);
      }
    }

    // 3. Deterministic Fallback Engine
    if (typeof fallbackGenerator === 'function') {
      return fallbackGenerator();
    }
    return { fallback: true };
  }

  async generateChat(messages, systemInstruction, fallbackReply) {
    if (process.env.GEMINI_API_KEY) {
      try {
        return await this.gemini.chat(messages, systemInstruction);
      } catch (err) {
        console.warn(`[AIProvider] Gemini chat failed: ${err.message}`);
      }
    }

    if (process.env.GROQ_API_KEY) {
      try {
        return await this.groq.chat(messages, systemInstruction);
      } catch (err) {
        console.warn(`[AIProvider] Groq chat failed: ${err.message}`);
      }
    }

    return fallbackReply || "I am currently analyzing your profile using our deterministic verification engine. All verified proofs and code evidence are actively tracked.";
  }
}

module.exports = new AIProviderManager();
