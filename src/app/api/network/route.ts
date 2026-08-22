import { NextResponse } from 'next/server';
import { stations, activeTrains } from '@/lib/mockData';

export async function GET() {
  try {
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        networkState: 'NORMAL',
        activeIncidents: 2,
        trains: activeTrains,
        stations: stations.map(station => ({
          ...station,
          currentCongestionLevel: Math.floor(Math.random() * 100),
          activePlatforms: Math.floor(Math.random() * 5) + 3
        }))
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch network state' }, { status: 500 });
  }
}
