import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (query) {
    const terms = query.split(" ").filter((term) => term.trim() !== "");

    const searchArgs = {
      AND: terms.map((term) => ({
        OR: [
          { marka: { contains: term, mode: "insensitive" } },
          { model: { contains: term, mode: "insensitive" } },
          { kategoria: { contains: term, mode: "insensitive" } },
        ],
      })),
    };

    const produkty = await prisma.produkt.findMany({
      where: searchArgs,
    });

    return Response.json([...produkty]);
  }
  
  return Response.json([]);
}
export const runtime = "nodejs";
