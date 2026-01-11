import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { ProductSchema } from '@/lib/validators';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

async function czyJestAdminem() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token_autoryzacji')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SEKRET_JWT);
    const uzytkownik = await prisma.uzytkownik.findUnique({ where: { id: payload.id } });
    return uzytkownik?.rola === 'admin';
  } catch (err) {
    return false;
  }
}

export async function POST(request) {
  if (!await czyJestAdminem()) {
    return NextResponse.json({ blad: 'Brak uprawnień administratora' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    const wynikWalidacji = ProductSchema.safeParse(body);
    
    if (!wynikWalidacji.success) {
      return NextResponse.json({ blad: 'Błąd walidacji', szczegoly: wynikWalidacji.error.flatten() }, { status: 400 });
    }

    const { kategoria, marka, model, cena, ilosc_na_magazynie, metadane } = wynikWalidacji.data;

    const produkt = await prisma.produkt.create({
      data: {
        kategoria,
        marka,
        model,
        cena,
        ilosc_na_magazynie,
        metadane 
      }
    });

    return NextResponse.json(produkt, { status: 201 });
  } catch (error) {
    console.error("Błąd dodawania produktu:", error);
    return NextResponse.json({ blad: 'Błąd serwera' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!await czyJestAdminem()) {
    return NextResponse.json({ blad: 'Brak uprawnień' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await prisma.produkt.delete({ where: { id } });
    return NextResponse.json({ sukces: true });
  } catch (error) {
    return NextResponse.json({ blad: 'Nie można usunąć produktu' }, { status: 500 });
  }
}