import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (query) {
    const searchFilter = { contains: query, mode: "insensitive" };

    const [aparaty, obiektywy, filmy] = await Promise.all([
      prisma.aparaty.findMany({
        where: {
          OR: [
            { marka: searchFilter },
            { model: searchFilter },
            { metadane: { is: { typ_matrycy: searchFilter } } }
          ],
        },
      }),
      prisma.obiektywy.findMany({
        where: {
          OR: [
            { marka: searchFilter },
            { model: searchFilter },
            { metadane: { is: { zakres_ogniskowej: searchFilter } } }
          ],
        },
      }),
      prisma.filmy.findMany({
        where: {
          OR: [
            { marka: searchFilter },
            { model: searchFilter },
            { metadane: { is: { czu_o__: searchFilter } } }
          ],
        },
      }),
    ]);

    return Response.json([...aparaty, ...obiektywy, ...filmy]);
  }

  const [aparaty, obiektywy, filmy] = await Promise.all([
    prisma.aparaty.findMany(),
    prisma.obiektywy.findMany(),
    prisma.filmy.findMany(),
  ]);

  return Response.json({ aparaty, obiektywy, filmy });
}