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
    const aktualneZamowienie = await prisma.zamowienie.findUnique({
      where: { id }
    });

    if (!aktualneZamowienie) {
      return NextResponse.json({ blad: 'Zamówienie nie istnieje' }, { status: 404 });
    }

    if (status === 'anulowane' && aktualneZamowienie.status !== 'anulowane') {
      
      const pozycjeZamowienia = await prisma.produktyZamowienia.findMany({
        where: { idZamowienia: id }
      });

      await Promise.all(pozycjeZamowienia.map(pozycja => {
        return prisma.produkt.update({
          where: { id: pozycja.idProduktu },
          data: { 
            ilosc_na_magazynie: { increment: pozycja.ilosc } 
          }
        });
      }));
    }

    const zaktualizowane = await prisma.zamowienie.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(zaktualizowane);
  } catch (error) {
    console.error("Błąd aktualizacji zamówienia:", error);
    return NextResponse.json({ blad: 'Błąd aktualizacji lub produkt nie istnieje' }, { status: 500 });
  }
}
export const runtime = "nodejs";
