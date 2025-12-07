"use client";
import { use } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";

const fetchProduct = async (id) => {
  const res = await fetch(`/api/produkt/${id}`);
  if (!res.ok) throw new Error("Produkt nie znaleziony");
  return res.json();
};

export default function ProduktPage({ params }) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const { data: produkt, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    retry: 1, 
  });

  if (isLoading) return <main className="p-6 text-center"><p>Wczytywanie...</p></main>;

  if (isError || !produkt || produkt.error) {
    return (
      <main className="p-6 text-center text-red-500">
        <p>Nie znaleziono produktu</p>
        <Link href="/produkty" className="inline-block mt-6 px-4 py-2 bg-gray-200 rounded">← Powrót</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(produkt);
    alert(`${produkt.marka} ${produkt.model} dodany do koszyka!`);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4">{produkt.marka} {produkt.model}</h1>
      <p className="text-gray-700 mb-2">Cena: {produkt.cena} zł</p>
      <p className="text-gray-500 mb-2">Na stanie: {produkt.ilosc_na_magazynie}</p>
      {produkt.metadane && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Specyfikacja:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
             {Object.entries(produkt.metadane).map(([key, value]) => {
                const label = key === 'czu_o__' ? 'Czułość' : key.replace(/_/g, ' ');
                return <li key={key}><span className="capitalize">{label}:</span> {value}</li>
             })}
          </ul>
        </div>
      )}

      <button onClick={handleAddToCart} className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto">
        Dodaj do koszyka
      </button>
      
      <div className="mt-4">
        <Link href="/produkty" className="text-gray-500 hover:underline">← Powrót do listy</Link>
      </div>
    </main>
  );
}