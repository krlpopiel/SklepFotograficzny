import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("sklep_fotograficzny");

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (query) {
    const regex = new RegExp(query, "i");

    const aparaty = await db.collection("aparaty").find({
      $or: [
        { marka: regex },
        { model: regex },
        { "metadane.typ_matrycy": regex }
      ]
    }).toArray();

    const obiektywy = await db.collection("obiektywy").find({
      $or: [
        { marka: regex },
        { model: regex },
        { "metadane.zakres_ogniskowej": regex }
      ]
    }).toArray();

    const filmy = await db.collection("filmy").find({
      $or: [
        { marka: regex },
        { model: regex },
        { "metadane.czułość": regex }
      ]
    }).toArray();

    return Response.json([...aparaty, ...obiektywy, ...filmy]);
  }

  const aparaty = await db.collection("aparaty").find({}).toArray();
  const obiektywy = await db.collection("obiektywy").find({}).toArray();
  const filmy = await db.collection("filmy").find({}).toArray();

  return Response.json({ aparaty, obiektywy, filmy });
}
