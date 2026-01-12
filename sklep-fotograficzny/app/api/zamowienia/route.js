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
  } catch (err) {
    return null;
  }
}

export async function POST(request) {
  try {
    const uzytkownikId = await pobierzIdUzytkownika();
    if (!uzytkownikId) {
      return NextResponse.json({ blad: 'Musisz być zalogowany, aby złożyć zamówienie.' }, { status: 401 });
    }

    const body = await request.json();
    const { koszyk, metodaWysylki, kosztWysylki, sumaCalkowita } = body;

    if (!koszyk || koszyk.length === 0) {
      return NextResponse.json({ blad: 'Koszyk jest pusty.' }, { status: 400 });
    }

    const wynikTransakcji = await prisma.$transaction(async (tx) => {
      for (const item of koszyk) {
        const produktZBazy = await tx.produkt.findUnique({ where: { id: item.id } });
        
        if (!produktZBazy) {
          throw new Error(`Produkt o ID ${item.id} nie istnieje.`);
        }
        
        if (produktZBazy.ilosc_na_magazynie < item.quantity) {
          throw new Error(`Brak wystarczającej ilości produktu: ${produktZBazy.marka} ${produktZBazy.model}. Dostępne: ${produktZBazy.ilosc_na_magazynie}`);
        }
      }

      const noweZamowienie = await tx.zamowienie.create({
        data: {
          uzytkownik: uzytkownikId, 
          status: 'oczekuje_na_platnosc',
          sumaCalkowita: parseFloat(sumaCalkowita),
          metodaWysylki: metodaWysylki,
          kosztWysylki: parseFloat(kosztWysylki),
        },
      });

      for (const item of koszyk) {
        await tx.produktyZamowienia.create({
          data: {
            idZamowienia: noweZamowienie.id,
            idProduktu: item.id,
            ilosc: item.quantity,
            cenaProduktu: parseFloat(item.cena),
          },
        });

        await tx.produkt.update({
          where: { id: item.id },
          data: {
            ilosc_na_magazynie: {
              decrement: item.quantity,
            },
          },
        });
      }

      return noweZamowienie;
    });

    return NextResponse.json({ zamowienieId: wynikTransakcji.id }, { status: 201 });

  } catch (error) {
    console.error("Błąd składania zamówienia:", error);
    return NextResponse.json({ blad: error.message || 'Wystąpił błąd podczas składania zamówienia.' }, { status: 500 });
  }
}