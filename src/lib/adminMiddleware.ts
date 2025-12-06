import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export function adminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  return payload;
}

export function requireAdmin(req: NextRequest) {
  const payload = adminAuth(req);
  if (!payload) return undefined; // 401 Unauthorized
  return payload;
}
