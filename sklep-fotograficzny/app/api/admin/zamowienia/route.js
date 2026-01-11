import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

async function czyJestAdminem() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token_autoryzacji')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SEKRET_JWT);
    const uzytkownik = await prisma.uzytkownik.findUnique({ where: { id: payload.id } });
    return uzytkownik?.rola === 'admin';
  } catch (err) { return false; }
}

export async function GET() {
  if (!await czyJestAdminem()) {
    return NextResponse.json({ blad: 'Brak uprawnień' }, { status: 403 });
  }

  const zamowienia = await prisma.zamowienie.findMany({
    orderBy: { dataZamowienia: 'desc' }
  });

  return NextResponse.json(zamowienia);
}

export async function PATCH(request) {
  if (!await czyJestAdminem()) {
    return NextResponse.json({ blad: 'Brak uprawnień' }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body;

  try {
    const zaktualizowane = await prisma.zamowienie.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(zaktualizowane);
  } catch (error) {
    return NextResponse.json({ blad: 'Błąd aktualizacji' }, { status: 500 });
  }
}