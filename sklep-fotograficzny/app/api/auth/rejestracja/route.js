export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { zahashujHaslo } from '@/lib/haslo';

export async function POST(request) {
  try {
    const body = await request.json();
    const { imie, email, haslo } = body;

    if (!imie || !email || !haslo) {
      return NextResponse.json(
        { blad: 'Wszystkie pola są wymagane.' },
        { status: 400 }
      );
    }

    const istniejacyUzytkownik = await prisma.uzytkownik.findUnique({
      where: { email },
    });

    if (istniejacyUzytkownik) {
      return NextResponse.json(
        { blad: 'Użytkownik o tym emailu już istnieje.' },
        { status: 409 }
      );
    }

    const bezpieczneHaslo = await zahashujHaslo(haslo);

    const nowyUzytkownik = await prisma.uzytkownik.create({
      data: {
        imie,
        email,
        haslo: bezpieczneHaslo,
        rola: 'uzytkownik', 
      },
    });

    const { haslo: _, ...uzytkownikBezHasla } = nowyUzytkownik;

    return NextResponse.json(
      { wiadomosc: 'Konto utworzone pomyślnie.', uzytkownik: uzytkownikBezHasla },
      { status: 201 }
    );

  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return NextResponse.json(
      { blad: 'Wystąpił błąd serwera podczas rejestracji.' },
      { status: 500 }
    );
  }
}