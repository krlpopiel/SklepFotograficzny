"use client";

import { useCart } from "@/context/CartContext";
import { uzyjUzytkownika } from "@/context/KontekstUzytkownika";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OPCJE_WYSYLKI = [
  { id: 'paczkomat', nazwa: 'Paczkomat InPost', cena: 14.99, czas: '1-2 dni' },
  { id: 'kurier', nazwa: 'Kurier DPD', cena: 19.99, czas: '1 dzień' },
  { id: 'odbior', nazwa: 'Odbiór osobisty', cena: 0.00, czas: 'Dzisiaj' },
];

export default function KasaPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { uzytkownik, ladowanie } = uzyjUzytkownika();
  const router = useRouter();

  const [wybranaWysylka, ustawWybranaWysylke] = useState(OPCJE_WYSYLKI[0]);
  const [przetwarzanie, ustawPrzetwarzanie] = useState(false);
  const [blad, ustawBlad] = useState('');
  const [zmontowany, ustawZmontowany] = useState(false);

  useEffect(() => {
    ustawZmontowany(true);
  }, []);

  useEffect(() => {
    // FIX: Jeśli przetwarzamy zamówienie, ignoruj pusty koszyk
    if (przetwarzanie) return;

    if (zmontowany && !ladowanie) {
      if (!uzytkownik) {
         // Opcjonalnie: Redirect do logowania
      } else if (cartItems.length === 0) {
        router.push('/produkty');
      }
    }
  }, [uzytkownik, ladowanie, cartItems, router, zmontowany, przetwarzanie]);

  const sumaProduktow = parseFloat(getCartTotal() || 0);
  const sumaDoZaplaty = (sumaProduktow + wybranaWysylka.cena).toFixed(2);

  const zlozZamowienie = async () => {
    if (!uzytkownik) {
        alert("Zaloguj się, aby złożyć zamówienie.");
        return;
    }
    
    ustawPrzetwarzanie(true);
    ustawBlad('');

    try {
      const res = await fetch('/api/zamowienia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koszyk: cartItems,
          metodaWysylki: wybranaWysylka.nazwa,
          kosztWysylki: wybranaWysylka.cena,
          sumaCalkowita: sumaDoZaplaty
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.blad || 'Błąd składania zamówienia');
      }
      
      clearCart();
      
      router.push(`/platnosc/${data.zamowienieId}`);

    } catch (err) {
      ustawBlad(err.message);
      ustawPrzetwarzanie(false);
    }
  };

  if (!zmontowany || ladowanie) {
    return <div className="text-center py-20">Ładowanie kasy...</div>;
  }
  
  if (!uzytkownik) {
      return (
          <div className="max-w-4xl mx-auto py-10 px-4 text-center">
              <h1 className="text-2xl mb-4">Musisz się zalogować</h1>
              <button onClick={() => router.push('/logowanie')} className="bg-blue-600 text-white px-6 py-2 rounded">Przejdź do logowania</button>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Kasa - Finalizacja zamówienia</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Metoda wysyłki
            </h2>
            <div className="space-y-3">
              {OPCJE_WYSYLKI.map((opcja) => (
                <label 
                  key={opcja.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    wybranaWysylka.id === opcja.id 
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="wysylka" 
                      className="accent-blue-600 w-5 h-5"
                      checked={wybranaWysylka.id === opcja.id}
                      onChange={() => ustawWybranaWysylke(opcja)}
                    />
                    <div>
                      <div className="font-medium text-gray-800">{opcja.nazwa}</div>
                      <div className="text-xs text-gray-500">Czas dostawy: {opcja.czas}</div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-700">
                    {opcja.cena === 0 ? 'Darmowa' : `${opcja.cena.toFixed(2)} zł`}
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Dane odbiorcy
            </h2>
            <div className="text-gray-700 text-sm space-y-1 pl-10">
              <p><span className="font-medium">Imię:</span> {uzytkownik.imie}</p>
              <p><span className="font-medium">Email:</span> {uzytkownik.email}</p>
              <p className="text-xs text-gray-500 mt-2">* Adres wysyłki zostanie pobrany z Twojego konta (domyślny).</p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 sticky top-24 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">Podsumowanie zamówienia</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-500 font-mono font-bold bg-white px-1 rounded border border-gray-200">{item.quantity}x</span>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 truncate max-w-[150px]" title={`${item.marka} ${item.model}`}>
                            {item.marka} {item.model}
                        </span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700 whitespace-nowrap">{(item.cena * item.quantity).toFixed(2)} zł</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Wartość produktów:</span>
                <span>{sumaProduktow.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between">
                <span>Koszt dostawy:</span>
                <span>{wybranaWysylka.cena.toFixed(2)} zł</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between items-center bg-blue-100 p-3 rounded -mx-2">
              <span className="text-lg font-bold text-gray-900">Do zapłaty:</span>
              <span className="text-2xl font-bold text-gray-900">{sumaDoZaplaty} zł</span>
            </div>

            {blad && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center font-medium">{blad}</div>}

            <button
              onClick={zlozZamowienie}
              disabled={przetwarzanie}
              className={`w-full mt-6 py-4 px-4 rounded-lg font-bold text-lg text-white transition-all transform shadow-md flex justify-center items-center gap-2 ${
                przetwarzanie 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {przetwarzanie ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              Klikając przycisk, akceptujesz regulamin sklepu.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}