import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const { contract, suggestions } = await req.json();

    if (!contract?.trim() || !suggestions?.trim()) {
      return NextResponse.json(
        { error: "Contract and suggestions are required" },
        { status: 400 },
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert Solidity developer. Fix smart contract issues based on audit suggestions. Return ONLY the corrected Solidity code with no markdown formatting or explanation.",
        },
        {
          role: "user",
          content: `Fix the following smart contract based on these audit suggestions:\n\nSuggestions:\n${suggestions}\n\nContract:\n\`\`\`solidity\n${contract}\n\`\`\`\n\nReturn only the fixed Solidity code.`,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const fixedContract = completion.choices[0].message.content?.trim();
    if (!fixedContract) {
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500 },
      );
    }

    const cleaned = fixedContract
      .replace(/^```solidity\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    return NextResponse.json({ contract: cleaned });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fix contract";
    console.error("Fix API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
