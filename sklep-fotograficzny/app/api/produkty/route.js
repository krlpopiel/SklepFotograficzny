import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("sklep_fotograficzny");

  const aparaty = await db.collection("aparaty").find({}).toArray();
  const obiektywy = await db.collection("obiektywy").find({}).toArray();
  const filmy = await db.collection("filmy").find({}).toArray();

  return Response.json({ aparaty, obiektywy, filmy });
}
