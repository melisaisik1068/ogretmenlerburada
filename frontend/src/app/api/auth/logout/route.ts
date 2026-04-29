import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("ob_access");
  cookieStore.delete("ob_refresh");
  return NextResponse.json({ ok: true });
}
