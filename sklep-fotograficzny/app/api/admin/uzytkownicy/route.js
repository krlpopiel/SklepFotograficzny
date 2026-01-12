import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

async function pobierzDaneAdmina() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token_autoryzacji')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SEKRET_JWT);
    const uzytkownik = await prisma.uzytkownik.findUnique({ where: { id: payload.id } });
    if (uzytkownik?.rola === 'admin') {
      return uzytkownik;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  const admin = await pobierzDaneAdmina();
  if (!admin) {
    return NextResponse.json({ blad: 'Brak uprawnień' }, { status: 403 });
  }

  const uzytkownicy = await prisma.uzytkownik.findMany({
    select: { id: true, imie: true, email: true, rola: true, dataUtworzenia: true }
  });
  
  return NextResponse.json(uzytkownicy);
}

export async function PATCH(request) {
  const admin = await pobierzDaneAdmina();
  if (!admin) {
    return NextResponse.json({ blad: 'Brak uprawnień' }, { status: 403 });
  }

  const { id, rola } = await request.json();

  if (id === admin.id) {
    return NextResponse.json(
      { blad: 'Nie możesz odebrać uprawnień administratorskich samemu sobie.' }, 
      { status: 400 }
    );
  }
  
  try {
    await prisma.uzytkownik.update({
      where: { id },
      data: { rola }
    });
    return NextResponse.json({ sukces: true });
  } catch (error) {
    return NextResponse.json({ blad: 'Błąd aktualizacji bazy danych' }, { status: 500 });
  }
}
export const runtime = "nodejs";
