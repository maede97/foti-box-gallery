import { environmentVariables } from "@/config/environment";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectToDatabase();
  const username = environmentVariables.INIT_ADMIN_USERNAME;
  const password = environmentVariables.INIT_ADMIN_PW;

  const exists = await Admin.findOne({ username });
  if (exists) {
    console.log(`Admin "${username}" already exists`);
    return NextResponse.json({ message: "ok" });
  }

  const admin = new Admin({ username, password });
  await admin.save();

  return NextResponse.json({ message: "ok" });
}

export const dynamic = "force-dynamic";
