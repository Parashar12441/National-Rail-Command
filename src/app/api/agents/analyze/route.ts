import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context = 'General' } = body;

    const systemPrompt = `You are the RailVerse AI Multi-Agent System for Indian Railways.
You must analyze the current railway network context and provide a JSON report from 5 specialized agents:
1. Operations: Network state, delays, congestion.
2. Scheduling: Routing, speed adjustments.
3. Platform: Platform allocation, conflicts.
4. Crowd: Crowd predictions, passenger flow.
5. Emergency: Incidents, risk assessments.

Return ONLY a valid JSON object in the exact following structure:
{
  "agents": {
    "operations": { "status": "STABLE" | "WARNING" | "ALERT" | "CRITICAL", "message": "string" },
    "scheduling": { "status": "STABLE" | "WARNING" | "ALERT" | "CRITICAL", "message": "string" },
    "platform": { "status": "STABLE" | "WARNING" | "ALERT" | "CRITICAL", "message": "string" },
    "crowd": { "status": "STABLE" | "WARNING" | "ALERT" | "CRITICAL", "message": "string" },
    "emergency": { "status": "STABLE" | "WARNING" | "ALERT" | "CRITICAL", "message": "string" }
  },
  "globalAssessment": "One sentence summary of overall network health."
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Current Context: ${context}` }
      ],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const responseContent = completion.choices[0]?.message?.content;
    const analysis = responseContent ? JSON.parse(responseContent) : {};

    return NextResponse.json({
      status: 'success',
      data: {
        context,
        timestamp: new Date().toISOString(),
        ...analysis
      }
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: 'Multi-agent analysis failed' }, { status: 500 });
  }
}
