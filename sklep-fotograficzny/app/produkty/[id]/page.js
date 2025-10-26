"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function ProduktPage({ params }) {
  const { id } = use(params);

  const [produkt, setProdukt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/produkt/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProdukt(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="p-6 text-center">
        <p>Wczytywanie...</p>
      </main>
    );
  }

  if (!produkt || produkt.error) {
    return (
      <main className="p-6 text-center text-red-500">
        <p>Nie znaleziono produktu</p>
        <Link
          href="/produkty"
          className="inline-block mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Powrót do listy
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4">
        {produkt.marka} {produkt.model}
      </h1>

      <p className="text-gray-700 mb-2">Cena: {produkt.cena} zł</p>
      <p className="text-gray-500 mb-2">
        Na stanie: {produkt.ilosc_na_magazynie}
      </p>

      {produkt.metadane && (
        <div className="mt-4 space-y-1">
          {produkt.metadane.typ_matrycy && (
            <p>Matryca: {produkt.metadane.typ_matrycy}</p>
          )}
          {produkt.metadane.zakres_ogniskowej && (
            <p>Ogniskowa: {produkt.metadane.zakres_ogniskowej}</p>
          )}
          {produkt.metadane.czułość && (
            <p>Czułość: {produkt.metadane.czułość}</p>
          )}
        </div>
      )}

      <Link
        href="/produkty"
        className="inline-block mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Powrót do listy
      </Link>
    </main>
  );
}
