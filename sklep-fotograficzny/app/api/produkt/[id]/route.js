import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db("sklep_fotograficzny");

  const kolekcje = ["aparaty", "obiektywy", "filmy"];
  let produkt = null;

  for (const nazwa of kolekcje) {
    const znaleziony = await db.collection(nazwa).findOne({ _id: new ObjectId(id) });
    if (znaleziony) {
      produkt = znaleziony;
      break;
    }
  }

  if (!produkt) {
    return new Response(JSON.stringify({ error: "Nie znaleziono produktu" }), { status: 404 });
  }

  return new Response(JSON.stringify(produkt), { status: 200 });
}
