import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token_autoryzacji');

  return NextResponse.json(
    { wiadomosc: 'Wylogowano pomyślnie.' },
    { status: 200 }
  );
}