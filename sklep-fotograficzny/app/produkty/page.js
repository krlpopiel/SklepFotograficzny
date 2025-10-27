import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import Form from "next/form"

export default async function ProduktyPage() {
  const client = await clientPromise;
  const db = client.db("sklep_fotograficzny");

  const aparaty = await db.collection("aparaty").find({}).toArray();
  const obiektywy = await db.collection("obiektywy").find({}).toArray();
  const filmy = await db.collection("filmy").find({}).toArray();

  const Sekcja = ({ tytul, dane }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">{tytul}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dane.map((p) => (
          <Link key={p._id} href={`/produkty/${p._id}`}>
          <div key={p._id} className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-1">{p.marka} {p.model}</h3>
            <p className="text-gray-600">Cena: <b>{p.cena} zł</b></p>
            <p className="text-gray-500">Na stanie: {p.ilosc_na_magazynie}</p>

            {p.metadane.typ_matrycy && <p className="text-sm text-gray-700 mt-2">Matryca: {p.metadane.typ_matrycy}</p>}
            {p.metadane.zakres_ogniskowej && <p className="text-sm text-gray-700">Ogniskowa: {p.metadane.zakres_ogniskowej}</p>}
            {p.metadane.czułość && <p className="text-sm text-gray-700">Czułość: {p.metadane.czułość}</p>}           
          </div>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Produkty fotograficzne</h1>
      <br></br>
      <Form action="/szukaj">
        <label htmlFor="szukane" className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Wpisz hasło do wyszukania:</label>
        <input type="text" id="szukane" name="szukane" className="input-primary mt-2 mb-2"></input>
        <button type="submit" className="btn-primary">Szukaj</button>
      </Form>
      <br></br>
      <Sekcja tytul="Aparaty" dane={aparaty} />
      <Sekcja tytul="Obiektywy" dane={obiektywy} />
      <Sekcja tytul="Filmy 35mm" dane={filmy} />
    </main>
  );
}
