import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sprawdzHaslo } from '@/lib/haslo';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SEKRET_JWT = new TextEncoder().encode(process.env.JWT_SECRET || 'tajny-klucz-deweloperski');

export async function POST(request) {
  try {
    const { email, haslo } = await request.json();

    const uzytkownik = await prisma.uzytkownik.findUnique({
      where: { email },
    });

    if (!uzytkownik) {
      return NextResponse.json(
        { blad: 'Nieprawidłowy email lub hasło.' },
        { status: 401 }
      );
    }

    const czyHasloPoprawne = await sprawdzHaslo(haslo, uzytkownik.haslo);

    if (!czyHasloPoprawne) {
      return NextResponse.json(
        { blad: 'Nieprawidłowy email lub hasło.' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ 
        id: uzytkownik.id, 
        email: uzytkownik.email, 
        rola: uzytkownik.rola 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SEKRET_JWT);

    const cookieStore = await cookies();
    cookieStore.set('token_autoryzacji', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, 
      path: '/',
    });

    const { haslo: _, ...uzytkownikBezHasla } = uzytkownik;

    return NextResponse.json(
      { wiadomosc: 'Zalogowano pomyślnie.', uzytkownik: uzytkownikBezHasla },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd logowania:', error);
    return NextResponse.json(
      { blad: 'Błąd serwera.' },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
