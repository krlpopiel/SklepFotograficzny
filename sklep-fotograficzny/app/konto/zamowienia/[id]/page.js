"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { uzyjUzytkownika } from '@/context/KontekstUzytkownika';

export default function SzczegolyZamowieniaUzytkownika() {
  const { id } = useParams();
  const router = useRouter();
  const { uzytkownik, ladowanie: ladowanieUsera } = uzyjUzytkownika();
  
  const [zamowienie, ustawZamowienie] = useState(null);
  const [blad, ustawBlad] = useState(null);

  useEffect(() => {
    if (!ladowanieUsera && !uzytkownik) router.push('/logowanie');
  }, [uzytkownik, ladowanieUsera, router]);

  useEffect(() => {
    if (uzytkownik && id) {
        fetch(`/api/moje-zamowienia/${id}`)
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.blad || 'Błąd pobierania');
                }
                return res.json();
            })
            .then(data => ustawZamowienie(data))
            .catch(err => ustawBlad(err.message));
    }
  }, [id, uzytkownik]);

  if (ladowanieUsera || (!zamowienie && !blad)) {
      return <div className="min-h-screen flex justify-center items-center text-slate-500">Ładowanie szczegółów...</div>;
  }

  if (blad) {
      return (
          <div className="min-h-screen flex flex-col justify-center items-center gap-4">
              <p className="text-red-500 font-bold">{blad}</p>
              <Link href="/konto" className="underline">Wróć do konta</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Nagłówek */}
        <div className="mb-6 flex items-center justify-between">
            <Link href="/konto" className="text-slate-500 hover:text-black font-medium text-sm">
                ← Powrót do listy
            </Link>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                zamowienie.status === 'zrealizowane' ? 'bg-green-100 text-green-700 border-green-200' :
                zamowienie.status === 'anulowane' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
                {zamowienie.status.replace(/_/g, ' ').toUpperCase()}
            </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Zamówienia */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Zamówienie #{zamowienie.id.slice(-6)}</h1>
                    <p className="text-sm text-slate-500 mt-1">Złożone dnia: {new Date(zamowienie.dataZamowienia).toLocaleDateString()} o {new Date(zamowienie.dataZamowienia).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400 uppercase font-bold">Łącznie</p>
                    <p className="text-xl font-bold text-slate-900">{zamowienie.sumaCalkowita.toFixed(2)} PLN</p>
                </div>
            </div>

            {/* Lista Produktów */}
            <div className="p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Produkty</h3>
                <div className="space-y-4">
                    {zamowienie.produkty.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                            <div>
                                <p className="font-bold text-slate-800">{item.produkt.marka} {item.produkt.model}</p>
                                <p className="text-sm text-slate-500">{item.ilosc} szt. × {item.cena.toFixed(2)} zł</p>
                            </div>
                            <span className="font-medium text-slate-700">
                                {(item.ilosc * item.cena).toFixed(2)} zł
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Szczegóły Dostawy */}
            <div className="bg-slate-50 p-6 border-t border-slate-100 grid grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Metoda Płatności</h4>
                    <p className="font-medium text-slate-700 capitalize">{zamowienie.metodaPlatnosci || 'Płatność Online'}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Dostawa</h4>
                    <p className="font-medium text-slate-700 capitalize">{zamowienie.metodaWysylki || 'Kurier'}</p>
                    {zamowienie.kosztWysylki > 0 && (
                        <p className="text-sm text-slate-500">+ {zamowienie.kosztWysylki} zł</p>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}