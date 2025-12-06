import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/event';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const events = await Event.find({}).sort({ createdAt: -1 });

  const eventsWithoutPasswords = events.map(event => {
    const eventObj = event.toObject();
    delete eventObj.password;
    return eventObj;
  });

  return NextResponse.json(eventsWithoutPasswords);
}