"use client";
import { useEffect, useState } from "react";

export default function ProduktyPage() {
  const [produkty, setProdukty] = useState({ aparaty: [], obiektywy: [], filmy: [] });

  useEffect(() => {
    fetch("/api/produkty")
      .then((res) => res.json())
      .then((data) => setProdukty(data));
  }, []);

  const Sekcja = ({ tytul, dane }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">{tytul}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dane.map((p) => (
          <div key={p._id} className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-1">{p.marka} {p.model}</h3>
            <p className="text-gray-600">Cena: <b>{p.cena} zł</b></p>
            <p className="text-gray-500">Na stanie: {p.ilosc}</p>

            {p.matryca && <p className="text-sm text-gray-700 mt-2">Matryca: {p.matryca}</p>}
            {p.ogniskowa && <p className="text-sm text-gray-700">Ogniskowa: {p.ogniskowa}</p>}
            {p.czułość && <p className="text-sm text-gray-700">Czułość: {p.czułość}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Produkty fotograficzne</h1>

      <Sekcja tytul="Aparaty" dane={produkty.aparaty} />
      <Sekcja tytul="Obiektywy" dane={produkty.obiektywy} />
      <Sekcja tytul="Filmy 35mm" dane={produkty.filmy} />
    </main>
  );
}
