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
  } catch (err) {
    return false;
  }
}

export async function GET(req) {
  if (!await czyJestAdminem()) return NextResponse.json({ blad: 'Brak dostępu' }, { status: 403 });
  
  const { searchParams } = new URL(req.url);
  const kategoria = searchParams.get('kategoria');

  const where = kategoria ? { kategoria } : {};
  const opcje = await prisma.slownikOpcji.findMany({ where, orderBy: { wartosc: 'asc' } });
  return NextResponse.json(opcje);
}

export async function POST(req) {
  if (!await czyJestAdminem()) return NextResponse.json({ blad: 'Brak dostępu' }, { status: 403 });

  const { kategoria, pole, wartosc } = await req.json();

  if (!wartosc || wartosc.trim() === '') {
      return NextResponse.json({ blad: 'Wartość nie może być pusta' }, { status: 400 });
  }

  const czystaWartosc = wartosc.trim();

  try {
    const istniejacyWpis = await prisma.slownikOpcji.findFirst({
      where: {
        kategoria,
        pole,
        wartosc: {
          equals: czystaWartosc,
          mode: 'insensitive' 
        }
      }
    });

    if (istniejacyWpis) {
      return NextResponse.json(
        { blad: `Wartość "${czystaWartosc}" już istnieje w tym polu.` }, 
        { status: 409 } 
      );
    }

    const nowaOpcja = await prisma.slownikOpcji.create({
      data: { kategoria, pole, wartosc: czystaWartosc }
    });
    
    return NextResponse.json(nowaOpcja);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ blad: 'Błąd serwera podczas zapisu.' }, { status: 500 });
  }
}

export async function DELETE(req) {
    if (!await czyJestAdminem()) return NextResponse.json({ blad: 'Brak dostępu' }, { status: 403 });
  
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    const opcja = await prisma.slownikOpcji.findUnique({ where: { id } });
    if (!opcja) return NextResponse.json({ blad: 'Opcja nie istnieje' }, { status: 404 });
  
    const produkty = await prisma.produkt.findMany({
      where: { kategoria: opcja.kategoria },
      select: { metadane: true }
    });
  
    const jestUzywana = produkty.some(p => {
      return p.metadane && p.metadane[opcja.pole] === opcja.wartosc;
    });
  
    if (jestUzywana) {
      return NextResponse.json({ 
        blad: `Nie można usunąć "${opcja.wartosc}", ponieważ jest przypisana do istniejących produktów.` 
      }, { status: 400 });
    }
  
    await prisma.slownikOpcji.delete({ where: { id } });
    return NextResponse.json({ sukces: true });
  }