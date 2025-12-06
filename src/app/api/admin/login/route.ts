import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password)
    return NextResponse.json({ error: 'Fehlende Zugangsdaten' }, { status: 400 });

  await connectToDatabase();
  const admin = await Admin.findOne({ username });
  if (!admin) return NextResponse.json({ error: 'Falsche Zugangsdaten' }, { status: 401 });

  const valid = await admin.comparePassword(password);
  if (!valid) return NextResponse.json({ error: 'Falsche Zugangsdaten' }, { status: 401 });

  const token = generateToken(admin._id.toString());
  return NextResponse.json({ token });
}

export const dynamic = 'force-dynamic';
