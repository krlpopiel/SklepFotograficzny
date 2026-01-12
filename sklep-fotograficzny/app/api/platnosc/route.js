'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StronaPlatnosci({ params }) {
  const { id: idZamowienia } = use(params);
  const router = useRouter();

  const [stan, ustawStan] = useState('wybor');
  const [metoda, ustawMetode] = useState('blik');

  const finalizujPlatnosc = async () => {
    ustawStan('przetwarzanie');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch('/api/platnosc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zamowienieId: idZamowienia,
          symulacjaStatusu: 'oplacone'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.blad || 'Błąd przetwarzania płatności');
      }

      ustawStan('gotowe');
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/zamowienie-sukces/${idZamowienia}`);

    } catch (error) {
      console.error("Błąd płatności:", error);
      alert(error.message || "Wystąpił błąd podczas przetwarzania płatności.");
      ustawStan('wybor');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bramka płatności</h1>
          <p className="text-gray-500 mt-2 text-sm">Transakcja bezpieczna</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 font-mono font-medium border border-blue-100">
            Zamówienie #{idZamowienia}
          </div>
        </div>

        <div className={`space-y-4 mb-8 transition-opacity duration-300 ${stan !== 'wybor' ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${metoda === 'blik' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold mr-3 text-gray-700">BLIK</div>
            <input type="radio" name="platnosc" value="blik" checked={metoda === 'blik'} onChange={(e) => ustawMetode(e.target.value)} className="w-5 h-5 accent-blue-600" />
            <span className="ml-3 font-semibold text-gray-800">BLIK</span>
          </label>

          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${metoda === 'karta' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold mr-3 text-gray-700">VISA</div>
            <input type="radio" name="platnosc" value="karta" checked={metoda === 'karta'} onChange={(e) => ustawMetode(e.target.value)} className="w-5 h-5 accent-blue-600" />
            <span className="ml-3 font-semibold text-gray-800">Karta Płatnicza</span>
          </label>
        </div>

        <button
          type="button"
          onClick={finalizujPlatnosc}
          disabled={stan !== 'wybor'}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-md flex justify-center items-center gap-2 ${stan === 'wybor'
            ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5'
            : stan === 'gotowe'
              ? 'bg-green-500 scale-105'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {stan === 'wybor' && 'Potwierdź i zapłać'}

          {stan === 'przetwarzanie' && (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Autoryzacja...
            </>
          )}

          {stan === 'gotowe' && (
            <>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Opłacono!
            </>
          )}
        </button>
      </div>
    </div>
  );
}