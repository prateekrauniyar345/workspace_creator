// app/api/ai/generate-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEIBUS_API_KEY!,
  baseURL: "https://api.studio.nebius.com/v1/",
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a workspace assistant. Only extract **exactly what the user says**. 
                    Return valid JSON only in this format:

                    {
                      "name": "Workspace Name",
                      "entries": ["AppOrSite1", "AppOrSite2"]
                    }

                    ⚠️ Do not add extra tools or services unless explicitly mentioned.
                    No explanations, only valid JSON.`,

        },         
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';
console.log("🧠 Raw AI Response:\n", raw); // ✅ Add this

const clean = raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
const parsed = JSON.parse(clean);



    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Nebius AI error:", err);
    return NextResponse.json({ error: 'Failed to generate profile' }, { status: 500 });
  }
}
