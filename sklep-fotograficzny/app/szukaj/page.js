"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const fetchSearchResults = async (query) => {
  const res = await fetch(`/api/produkty?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export default function SzukajPage() {
  return (
    <Suspense fallback={<p className="text-center p-6">Wczytywanie...</p>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("szukane") || "";

  const { data: wyniki, isLoading, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query,
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Wyniki wyszukiwania</h1>
      <p className="text-center mb-6 text-gray-600">Szukane hasło: <b>{query}</b></p>

      {isLoading && <p className="text-center">Wczytywanie wyników...</p>}
      {isError && <p className="text-center text-red-500">Wystąpił błąd.</p>}
      {!isLoading && wyniki && wyniki.length === 0 && <p className="text-center">Brak wyników.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wyniki?.map((p) => (
          <Link key={p.id} href={`/produkty/${p.id}`}>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-1">{p.marka} {p.model}</h3>
              <p className="text-gray-600">Cena: <b>{p.cena} zł</b></p>
              {p.metadane?.typ_matrycy && <p className="text-sm text-gray-500">Matryca: {p.metadane.typ_matrycy}</p>}
              {p.metadane?.zakres_ogniskowej && <p className="text-sm text-gray-500">Ogniskowa: {p.metadane.zakres_ogniskowej}</p>}
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