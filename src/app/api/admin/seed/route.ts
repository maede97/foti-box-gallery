import { environmentVariables } from '@/config/environment';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const username = environmentVariables.INIT_ADMIN_USERNAME;
  const password = environmentVariables.INIT_ADMIN_PW;

  const exists = await Admin.findOne({ username });
  if (exists) {
    console.log(`Admin "${username}" existiert bereits`);
    return NextResponse.json({ message: 'ok' });
  }

  const admin = new Admin({ username, password });
  await admin.save();

  return NextResponse.json({ message: 'ok' });
}

export const dynamic = 'force-dynamic';
