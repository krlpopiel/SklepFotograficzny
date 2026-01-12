export const runtime = "nodejs";
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

export async function GET(request, props) {
  if (!await czyJestAdminem()) return NextResponse.json({ blad: 'Brak dostępu' }, { status: 403 });

  const params = await props.params;
  const { id } = params;

  try {
    const zamowienie = await prisma.zamowienie.findUnique({
      where: { id },
    });

    if (!zamowienie) return NextResponse.json({ blad: 'Nie znaleziono' }, { status: 404 });

    let daneUzytkownika = null;
    if (zamowienie.uzytkownik) {
        daneUzytkownika = await prisma.uzytkownik.findUnique({
            where: { id: zamowienie.uzytkownik },
            select: { id: true, imie: true, email: true }
        });
    }

    const pozycjeZamowienia = await prisma.produktyZamowienia.findMany({
        where: { idZamowienia: id }
    });

    const idsProduktow = pozycjeZamowienia.map(p => p.idProduktu);
    
    const produktyDetale = await prisma.produkt.findMany({
        where: { id: { in: idsProduktow } },
        select: { id: true, marka: true, model: true }
    });

    const produktyWZamowieniu = pozycjeZamowienia.map(pozycja => {
        const detale = produktyDetale.find(p => p.id === pozycja.idProduktu);
        
        return {
            ...pozycja,
            produkt: detale || { marka: 'Produkt', model: 'Usunięty/Nieznany' },
            cena: pozycja.cenaProduktu 
        };
    });

    const odpowiedz = {
        ...zamowienie,
        uzytkownikId: zamowienie.uzytkownik,
        uzytkownik: daneUzytkownika || { imie: 'Nieznany', email: 'Brak danych', id: zamowienie.uzytkownik },
        produkty: produktyWZamowieniu 
    };
    
    return NextResponse.json(odpowiedz);

  } catch (error) {
    console.error("Błąd API Zamówienia:", error);
    return NextResponse.json({ blad: 'Błąd serwera' }, { status: 500 });
  }
}