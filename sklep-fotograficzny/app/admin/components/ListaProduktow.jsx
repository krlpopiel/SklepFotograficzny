"use client";
import { useState, useEffect } from 'react';

export default function ListaProduktow({ naEdycje }) {
  const [produkty, ustawProdukty] = useState([]);

  const pobierz = async () => {
    const res = await fetch('/api/admin/produkty');
    if (res.ok) ustawProdukty(await res.json());
  };

  useEffect(() => { pobierz(); }, []);

  const usun = async (id) => {
    if (!confirm('Czy na pewno usunąć ten produkt?')) return;
    const res = await fetch(`/api/admin/produkty?id=${id}`, { method: 'DELETE' });
    if (res.ok) pobierz();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
          <tr>
            <th className="p-4">Nazwa</th>
            <th className="p-4">Kategoria</th>
            <th className="p-4">Cena</th>
            <th className="p-4">Magazyn</th>
            <th className="p-4 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {produkty.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="p-4 font-medium">
                {p.marka} {p.model}
              </td>
              <td className="p-4 text-slate-500">{p.kategoria}</td>
              <td className="p-4 font-bold">{p.cena} zł</td>
              <td className="p-4">{p.ilosc_na_magazynie} szt.</td>
              <td className="p-4 text-right space-x-2">
                <button 
                    onClick={() => naEdycje(p)}
                    className="text-amber-600 hover:underline font-medium"
                >
                    Edytuj
                </button>
                <button 
                    onClick={() => usun(p.id)}
                    className="text-red-600 hover:underline"
                >
                    Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}