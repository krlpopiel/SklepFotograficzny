"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SzukajPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("szukane") || "";
  const [wyniki, setWyniki] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    fetch(`/api/produkty?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setWyniki(data);
        setLoading(false);
      });
  }, [query]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Wyniki wyszukiwania</h1>
      <p className="text-center mb-6 text-gray-600">Szukane hasło: <b>{query}</b></p>

      {loading && <p>Wczytywanie wyników...</p>}
      {!loading && wyniki.length === 0 && <p>Brak wyników.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wyniki.map((p) => (
          <Link key={p._id} href={`/produkty/${p._id}`}>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-1">{p.marka} {p.model}</h3>
              <p className="text-gray-600">Cena: <b>{p.cena} zł</b></p>
              <p className="text-gray-500">Na stanie: {p.ilosc_na_magazynie}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/produkty" className="text-blue-600 hover:underline">← Powrót do wszystkich produktów</Link>
      </div>
    </main>
  );
}
