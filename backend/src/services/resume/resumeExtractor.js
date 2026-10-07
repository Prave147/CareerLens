const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { GoogleGenAI } = require('@google/genai');

class ResumeExtractor {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  getSystemInstruction() {
    return `You are CareerLens Resume Intelligence Engine, an expert technical document auditor.
Your job is to perform HIGH-PRECISION STRUCTURED EXTRACTION of information explicitly present in student/candidate resumes.

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY extract information that is ACTUALLY and EXPLICITLY written in the resume document.
2. If any field or section is not mentioned, return null, [] or an empty list.
3. NEVER infer or invent technologies (e.g., do NOT assume Django if Python is listed; do NOT assume Next.js if React is listed; do NOT assume Keras if TensorFlow is listed).
4. NEVER invent CGPAs, dates, URLs, company names, or responsibilities.
5. Extract exact quotes into "evidenceText" and "sourceText" for auditing.
6. Categorize skills into: PROGRAMMING, FRAMEWORK, DATABASE, AI_ML, CLOUD, DEVOPS, TOOL, OTHER.
7. Categorize claims into: SKILL, PROJECT, EXPERIENCE, ACHIEVEMENT, CERTIFICATION, OTHER.
8. Output STRICT VALID JSON matching the required schema. No markdown wrapping outside the JSON object.`;
  }

  getPrompt() {
    return `Extract all structured resume data from the attached document.

Return a JSON object conforming strictly to this structure:
{
  "candidate": {
    "name": string or null,
    "email": string or null,
    "phone": string or null,
    "location": string or null
  },
  "summary": string or null,
  "education": [
    {
      "degree": string,
      "institution": string,
      "field": string or null,
      "startYear": integer or null,
      "endYear": integer or null,
      "cgpa": string or null,
      "percentage": string or null,
      "evidenceText": string
    }
  ],
  "skills": [
    {
      "name": string,
      "category": "PROGRAMMING" | "FRAMEWORK" | "DATABASE" | "AI_ML" | "CLOUD" | "DEVOPS" | "TOOL" | "OTHER",
      "evidenceText": string,
      "confidence": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": [string],
      "responsibilities": [string],
      "outcomes": [string],
      "githubUrl": string or null,
      "demoUrl": string or null,
      "startDate": string or null,
      "endDate": string or null,
      "evidenceText": string
    }
  ],
  "experience": [
    {
      "company": string,
      "role": string,
      "location": string or null,
      "startDate": string or null,
      "endDate": string or null,
      "responsibilities": [string],
      "achievements": [string],
      "evidenceText": string
    }
  ],
  "internships": [
    {
      "company": string,
      "role": string or null,
      "startDate": string or null,
      "endDate": string or null,
      "responsibilities": [string],
      "technologies": [string],
      "evidenceText": string
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string or null,
      "date": string or null,
      "credentialUrl": string or null,
      "evidenceText": string
    }
  ],
  "achievements": [
    {
      "title": string,
      "description": string,
      "date": string or null,
      "evidenceText": string
    }
  ],
  "hackathons": [
    {
      "name": string,
      "role": string or null,
      "result": string or null,
      "date": string or null,
      "description": string or null,
      "evidenceText": string
    }
  ],
  "codingProfiles": [
    {
      "platform": "GITHUB" | "LEETCODE" | "GFG" | "CODECHEF" | "CODEFORCES" | "HACKERRANK" | "OTHER",
      "username": string or null,
      "url": string or null,
      "evidenceText": string
    }
  ],
  "claims": [
    {
      "claim": string,
      "claimType": "SKILL" | "PROJECT" | "EXPERIENCE" | "ACHIEVEMENT" | "CERTIFICATION" | "OTHER",
      "sourceText": string,
      "sourceSection": string,
      "relatedSkill": string or null,
      "verificationStatus": "PENDING"
    }
  ]
}`;
  }

  /**
   * Extracts structured data from a PDF resume buffer using Gemini Multimodal Document Understanding
   */
  async extractFromPdf(pdfBuffer, originalFileName = 'resume.pdf') {
    const startTime = Date.now();

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in backend environment.');
    }

    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }

    const base64Data = pdfBuffer.toString('base64');
    const systemInstruction = this.getSystemInstruction();
    const userPrompt = this.getPrompt();

    // Prepare contents array with PDF inline data part and text instruction part
    const contents = [
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
      `${systemInstruction}\n\nDocument File: ${originalFileName}\n\n${userPrompt}`,
    ];

    const modelsToAttempt = [
      this.modelName,
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    let lastError = null;

    for (const model of modelsToAttempt) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`[ResumeExtractor] Analyzing "${originalFileName}" with ${model} (attempt ${attempt + 1})...`);
          
          const response = await this.ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1, // Low temperature for high precision and anti-hallucination
            },
          });

          const responseText = response.text;
          if (!responseText) {
            throw new Error('Received empty text response from Gemini.');
          }

          let parsedJson;
          try {
            // Strip any accidental markdown formatting if present
            const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
            parsedJson = JSON.parse(cleanJson);
          } catch (parseErr) {
            throw new Error(`Failed to parse Gemini structured JSON: ${parseErr.message}`);
          }

          const processingTimeMs = Date.now() - startTime;
          console.log(`[ResumeExtractor] Extraction complete in ${processingTimeMs}ms using ${model}`);

          return {
            raw: parsedJson,
            metadata: {
              provider: 'Gemini',
              model: model,
              processingTimeMs,
              extractedAt: new Date(),
            },
          };
        } catch (err) {
          lastError = err;
          console.warn(`[ResumeExtractor] Model ${model} attempt ${attempt + 1} failed: ${err.message}`);
          // If transient demand spike, wait briefly before retry
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1200));
          }
        }
      }
    }

    throw new Error(`Resume analysis failed across all attempts: ${lastError?.message || 'Unknown error'}`);
  }
}

module.exports = new ResumeExtractor();
