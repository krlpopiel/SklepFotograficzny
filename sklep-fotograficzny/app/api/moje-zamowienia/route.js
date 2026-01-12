export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

async function pobierzIdUzytkownika() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token_autoryzacji')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SEKRET_JWT);
    return payload.id;
  } catch { return null; }
}

export async function GET() {
  const userId = await pobierzIdUzytkownika();
  if (!userId) {
    return NextResponse.json({ blad: 'Nie jesteś zalogowany' }, { status: 401 });
  }

  try {
    const zamowienia = await prisma.zamowienie.findMany({
      where: { uzytkownik: userId }, 
      orderBy: { dataZamowienia: 'desc' }
    });

    return NextResponse.json(zamowienia);
  } catch (error) {
    return NextResponse.json({ blad: 'Błąd serwera' }, { status: 500 });
  }
}