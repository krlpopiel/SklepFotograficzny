import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { zamowienieId, symulacjaStatusu } = await request.json();

    if (!zamowienieId) {
      return NextResponse.json({ blad: 'Brak ID zamówienia.' }, { status: 400 });
    }

    const zaktualizowaneZamowienie = await prisma.zamowienie.update({
      where: { id: zamowienieId },
      data: {
        status: symulacjaStatusu || 'oplacone', 
      },
    });

    return NextResponse.json({ 
      wiadomosc: 'Płatność przyjęta pomyślnie.', 
      status: zaktualizowaneZamowienie.status 
    }, { status: 200 });

  } catch (error) {
    console.error("Błąd płatności:", error);
    return NextResponse.json({ blad: 'Błąd przetwarzania płatności.' }, { status: 500 });
  }
}