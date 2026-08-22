import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stationId, date = new Date().toISOString(), event = 'None' } = body;

    if (!stationId) {
      return NextResponse.json({ error: 'stationId is required' }, { status: 400 });
    }

    // Simulate AI inference delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock crowd prediction
    const isSpecialEvent = event !== 'None';
    const baseCrowd = Math.floor(Math.random() * 40) + 20; // 20-60
    const eventMultiplier = isSpecialEvent ? 1.5 + Math.random() : 1.0;
    
    let crowdLevel = Math.min(100, Math.floor(baseCrowd * eventMultiplier));
    
    let riskLevel = 'LOW';
    if (crowdLevel > 85) riskLevel = 'CRITICAL';
    else if (crowdLevel > 70) riskLevel = 'HIGH';
    else if (crowdLevel > 50) riskLevel = 'MEDIUM';

    // Break down across platforms
    const platforms = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
      platformNumber: i + 1,
      crowdDensity: Math.min(100, Math.floor(crowdLevel * (0.5 + Math.random())))
    }));

    const staffRequirements = {
      rpfPersonnel: Math.ceil(crowdLevel * 0.15),
      ticketingStaff: Math.ceil(crowdLevel * 0.05),
      cleaningStaff: Math.ceil(crowdLevel * 0.08)
    };

    return NextResponse.json({
      status: 'success',
      data: {
        stationId,
        prediction: {
          crowdLevel,
          riskLevel,
          platforms,
          model: 'RandomForest-Crowd-v1.4',
          accuracyScore: (Math.random() * 5 + 90).toFixed(1), // 90-95%
          staffRequirements
        }
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process crowd prediction' }, { status: 500 });
  }
}
