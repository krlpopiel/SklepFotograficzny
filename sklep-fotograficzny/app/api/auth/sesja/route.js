import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token_autoryzacji')?.value;

    if (!token) {
      return NextResponse.json({ uzytkownik: null }, { status: 200 });
    }

    const { payload } = await jwtVerify(token, SEKRET_JWT);

    const uzytkownik = await prisma.uzytkownik.findUnique({
      where: { id: payload.id },
      select: { id: true, imie: true, email: true, rola: true }
    });

    if (!uzytkownik) {
      return NextResponse.json({ uzytkownik: null }, { status: 200 });
    }

    return NextResponse.json({ uzytkownik }, { status: 200 });

  } catch (error) {
    console.error("Błąd weryfikacji sesji:", error.message);
    return NextResponse.json({ uzytkownik: null }, { status: 200 });
  }
}
export const runtime = "nodejs";
