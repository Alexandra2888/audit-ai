import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert smart contract security auditor. Analyze Solidity smart contracts for vulnerabilities, gas efficiency, code quality, and best practices. Always respond with valid JSON matching the exact schema requested.`;

const buildUserPrompt = (
  contract: string,
) => `Audit the following Solidity smart contract. Provide results as a JSON object with a "results" key containing this exact array structure:

{
  "results": [
    {
      "section": "Audit Report",
      "details": "A comprehensive audit report covering security vulnerabilities, reentrancy risks, overflow/underflow issues, access control problems, and overall architecture assessment."
    },
    {
      "section": "Metric Scores",
      "details": [
        { "metric": "Security", "score": <0-10> },
        { "metric": "Performance", "score": <0-10> },
        { "metric": "Gas Efficiency", "score": <0-10> },
        { "metric": "Code Quality", "score": <0-10> },
        { "metric": "Documentation", "score": <0-10> },
        { "metric": "Best Practices", "score": <0-10> }
      ]
    },
    {
      "section": "Suggestions for Improvement",
      "details": "Specific, actionable suggestions for improving the contract."
    }
  ]
}

Smart contract to audit:
\`\`\`solidity
${contract}
\`\`\``;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local",
      },
      { status: 500 },
    );
  }

  try {
    const { contract } = await req.json();

    if (!contract?.trim()) {
      return NextResponse.json(
        { error: "No contract provided" },
        { status: 400 },
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(contract) },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content);
    const results = Array.isArray(parsed) ? parsed : (parsed.results ?? parsed);

    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to audit contract";
    console.error("Audit API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
