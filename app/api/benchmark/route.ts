import { NextResponse } from 'next/server';
import { loadBenchmarkData } from '@/lib/benchmark';

export async function GET() {
  try {
    const data = await loadBenchmarkData();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to load benchmark dataset' },
      { status: 500 }
    );
  }
}
