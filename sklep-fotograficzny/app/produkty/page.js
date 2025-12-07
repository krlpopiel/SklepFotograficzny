import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Form from "next/form";

const Sekcja = ({ tytul, dane }) => {
  if (!dane || dane.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">{tytul}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dane.map((p) => (
          <Link key={p.id} href={`/produkty/${p.id}`}>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-1">{p.marka} {p.model}</h3>
              <p className="text-gray-600">Cena: <b>{p.cena} zł</b></p>
              <p className="text-gray-500">Na stanie: {p.ilosc_na_magazynie}</p>
              {p.metadane?.typ_matrycy && (
                <p className="text-sm text-gray-700 mt-2">Matryca: {p.metadane.typ_matrycy}</p>
              )}
              {p.metadane?.zakres_ogniskowej && (
                <p className="text-sm text-gray-700 mt-2">Ogniskowa: {p.metadane.zakres_ogniskowej}</p>
              )}
              {p.metadane?.czu_o__ && (
                <p className="text-sm text-gray-700 mt-2">Czułość: {p.metadane.czu_o__}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default async function ProduktyPage() {
  const [aparaty, obiektywy, filmy] = await Promise.all([
    prisma.aparaty.findMany(),
    prisma.obiektywy.findMany(),
    prisma.filmy.findMany(),
  ]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Produkty fotograficzne</h1>
      
      <Form action="/szukaj" className="mb-8">
        <label htmlFor="szukane" className="text-2xl font-bold block mb-2">Wpisz hasło do wyszukania:</label>
        <div className="flex gap-2">
           <input type="text" id="szukane" name="szukane" className="border p-2 rounded flex-grow" required placeholder="np. Canon, 35mm..." />
           <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Szukaj</button>
        </div>
      </Form>

      <Sekcja tytul="Aparaty" dane={aparaty} />
      <Sekcja tytul="Obiektywy" dane={obiektywy} />
      <Sekcja tytul="Filmy 35mm" dane={filmy} />
    </main>
  );
}