import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
     return Response.json({ error: "Nieprawidłowe ID" }, { status: 400 });
  }

  try {
    let produkt = await prisma.produkt.findUnique({ where: { id } });

    if (!produkt) {
      return Response.json({ error: "Nie znaleziono produktu" }, { status: 404 });
    }

    return Response.json(produkt);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
export const runtime = "nodejs";
