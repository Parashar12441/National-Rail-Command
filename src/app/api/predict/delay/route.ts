import { NextResponse } from 'next/server';
import { generateRandomDelay } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trainId, weather = 'Clear', timeOfDay = 'Morning' } = body;

    if (!trainId) {
      return NextResponse.json({ error: 'trainId is required' }, { status: 400 });
    }

    // Simulate AI inference delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const delayPrediction = generateRandomDelay();
    
    // Generate contributing factors based on whether there's a delay
    const factors = delayPrediction.status === 'DELAYED' 
      ? [
          { factor: 'Weather', impact: Math.floor(Math.random() * 40) + 10 },
          { factor: 'Network Congestion', impact: Math.floor(Math.random() * 50) + 20 },
          { factor: 'Track Maintenance', impact: Math.floor(Math.random() * 30) }
        ].filter(f => f.impact > 0).sort((a, b) => b.impact - a.impact)
      : [];

    return NextResponse.json({
      status: 'success',
      data: {
        trainId,
        prediction: {
          predictedDelayMinutes: delayPrediction.delayMinutes,
          confidenceScore: Number(delayPrediction.confidence),
          status: delayPrediction.status,
          model: 'XGBoost-Weighted-v2.1',
          factors,
          propagationRisk: delayPrediction.delayMinutes > 60 ? 'HIGH' : (delayPrediction.delayMinutes > 30 ? 'MEDIUM' : 'LOW')
        }
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process delay prediction' }, { status: 500 });
  }
}
