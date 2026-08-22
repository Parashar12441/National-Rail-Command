import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenario, ...params } = body;

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario type is required' }, { status: 400 });
    }

    const systemPrompt = `You are the RailVerse AI Simulation Engine for Indian Railways.
You must simulate the outcome of the given scenario and provide a structured JSON response.
The response must follow this exact JSON schema:
{
  "impactAnalysis": {
    "primaryImpact": "String describing the main consequence",
    // Include 2-3 other string keys relevant to the scenario 
    // (e.g. "networkImpact", "estimatedRecoveryTime" for delays, or "peakCrowdTime", "resourceShortfall" for crowds)
  },
  "recommendedActions": [
    "Action 1",
    "Action 2",
    "Action 3"
  ],
  "confidenceInterval": "String like '88-92%'"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Scenario: ${scenario}\nParameters: ${JSON.stringify(params)}` }
      ],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content;
    const result = responseContent ? JSON.parse(responseContent) : {};

    return NextResponse.json({
      status: 'success',
      data: {
        scenario,
        simulationId: `sim_${Math.random().toString(36).substring(7)}`,
        ...result
      }
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: 'Simulation engine failed' }, { status: 500 });
  }
}
