import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json({ blad: 'Brak ID zamówienia' }, { status: 400 });
    }

    const zaktualizowaneZamowienie = await prisma.zamowienie.update({
      where: { id: id },
      data: { status: status },
    });

    return NextResponse.json({ 
      sukces: true, 
      zamowienie: zaktualizowaneZamowienie 
    });

  } catch (error) {
    console.error("Błąd aktualizacji zamówienia:", error);
    return NextResponse.json({ blad: 'Nie udało się zaktualizować zamówienia' }, { status: 500 });
  }
}