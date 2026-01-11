"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function SzczegolyZamowieniaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [zamowienie, ustawZamowienie] = useState(null);
  const [ladowanie, ustawLadowanie] = useState(true);

  const STATUSY = [
    { key: 'oczekuje_na_platnosc', label: 'Oczekuje na płatność' },
    { key: 'oplacone', label: 'Opłacone (Do realizacji)' },
    { key: 'w_realizacji', label: 'W trakcie pakowania' },
    { key: 'wyslane', label: 'Wysłane do klienta' },
    { key: 'zrealizowane', label: 'Zakończone' },
    { key: 'anulowane', label: 'Anulowane' }
  ];

  const pobierzZamowienie = async () => {
    try {
      const res = await fetch(`/api/admin/zamowienia/${id}`);
      if (!res.ok) throw new Error('Błąd pobierania');
      const data = await res.json();
      ustawZamowienie(data);
    } catch (err) {
      alert('Nie udało się pobrać zamówienia');
      router.push('/admin');
    } finally {
      ustawLadowanie(false);
    }
  };

  useEffect(() => {
    if (id) pobierzZamowienie();
  }, [id]);

  const zmienStatus = async (nowyStatus) => {
    if (!confirm(`Czy na pewno zmienić status na: ${nowyStatus}?`)) return;

    const res = await fetch('/api/admin/zamowienia', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nowyStatus })
    });

    if (res.ok) {
      pobierzZamowienie(); // Odśwież widok
    } else {
      alert('Wystąpił błąd podczas zmiany statusu');
    }
  };

  if (ladowanie) return <div className="p-10 text-center">Ładowanie danych zamówienia...</div>;
  if (!zamowienie) return <div className="p-10 text-center">Nie znaleziono zamówienia.</div>;

  const obecnyIndex = STATUSY.findIndex(s => s.key === zamowienie.status);
  const nastepnyStatus = obecnyIndex >= 0 && obecnyIndex < 4 ? STATUSY[obecnyIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Nagłówek i nawigacja */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-slate-500 hover:text-slate-800 font-medium">
          ← Wróć do listy
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          Zamówienie #{zamowienie.id.slice(-6)}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
             zamowienie.status === 'zrealizowane' ? 'bg-green-100 text-green-700 border-green-200' :
             zamowienie.status === 'anulowane' ? 'bg-red-100 text-red-700 border-red-200' :
             'bg-amber-100 text-amber-800 border-amber-200'
        }`}>
            {STATUSY.find(s => s.key === zamowienie.status)?.label || zamowienie.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEWA KOLUMNA - Szczegóły */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Lista produktów */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Zawartość koszyka</h2>
                <div className="space-y-4">
                    {zamowienie.produkty.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                            <div>
                                <p className="font-bold text-slate-800">{item.produkt?.marka} {item.produkt?.model}</p>
                                <p className="text-sm text-slate-500">Ilość: {item.ilosc} szt.</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{(item.cena * item.ilosc).toFixed(2)} PLN</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-lg font-bold">
                    <span>Razem do zapłaty:</span>
                    <span>{zamowienie.sumaCalkowita.toFixed(2)} PLN</span>
                </div>
            </div>

            {/* Dane Klienta i Dostawy */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Dane operacyjne</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Klient</h3>
                        <p className="font-medium">{zamowienie.uzytkownik?.imie}</p>
                        <p className="text-sm text-slate-500">{zamowienie.uzytkownik?.email}</p>
                        <p className="text-sm text-slate-400 font-mono mt-1">ID: {zamowienie.uzytkownikId}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Metoda Dostawy</h3>
                        <p className="font-medium capitalize">{zamowienie.metodaDostawy || 'Kurier Standard'}</p>
                        
                        <h3 className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2">Płatność</h3>
                        <p className="font-medium capitalize">{zamowienie.metodaPlatnosci || 'Przelewy24'}</p>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Adres dostawy</h3>
                    <div className="bg-slate-50 p-3 rounded text-sm text-slate-700">
                        {/* Zakładamy że adres jest w obiekcie lub stringu - dostosuj do swojego modelu */}
                        {zamowienie.adres ? (
                             <>
                                <p>{zamowienie.adres.ulica} {zamowienie.adres.numerDomu}</p>
                                <p>{zamowienie.adres.kodPocztowy} {zamowienie.adres.miasto}</p>
                             </>
                        ) : (
                            <p className="italic">Brak szczegółowych danych adresowych w tym widoku (użyto danych konta).</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* PRAWA KOLUMNA - Panel Akcji (Workflow) */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                <h2 className="text-lg font-bold mb-4">Zarządzanie statusem</h2>
                
                {/* Szybka akcja - następny krok */}
                {nastepnyStatus && zamowienie.status !== 'anulowane' && (
                    <button 
                        onClick={() => zmienStatus(nastepnyStatus.key)}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold mb-4 hover:bg-slate-800 transition shadow-md"
                    >
                        Przesuń status na: <br/>
                        <span className="text-amber-400">{nastepnyStatus.label}</span>
                    </button>
                )}

                {/* Lista ręcznej zmiany */}
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-2">Zmień ręcznie na:</p>
                    {STATUSY.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => zmienStatus(s.key)}
                            disabled={zamowienie.status === s.key}
                            className={`w-full text-left px-3 py-2 rounded text-sm border transition-colors ${
                                zamowienie.status === s.key 
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-white border-slate-200 hover:border-amber-400 hover:text-amber-600'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => zmienStatus('anulowane')}
                        className="w-full text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 py-2 rounded font-bold text-sm transition"
                    >
                        Anuluj zamówienie
                    </button>
                    <p className="text-xs text-red-400 mt-2 text-center">Ta operacja zwróci produkty na magazyn (logika backendu).</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}