"use client";
import { useState, useEffect } from 'react';
import { ProductSchema, AparatyMetadaneSchema, FilmyMetadaneSchema, ObiektywyMetadaneSchema } from '@/lib/validators';

export default function FormularzProduktu({ edytowanyProdukt, poZapisaniu }) {
  const [kategoria, ustawKategorie] = useState('aparaty');
  const [baza, ustawBaza] = useState({ marka: '', model: '', cena: '', ilosc_na_magazynie: '' });
  const [meta, ustawMeta] = useState({});
  const [info, ustawInfo] = useState(null);
  
  // Stan dla pobranych opcji słownikowych
  const [dostepneOpcje, ustawDostepneOpcje] = useState([]);

  // Definiujemy, które pola mają być listą rozwijaną (muszą pasować do kluczy w validators.ts)
  const POLA_SLOWNIKOWE = ['typ_matrycy', 'typ_mocowania', 'typ', 'format', 'typ_baterii', 'producent'];

  // 1. Ładowanie danych przy edycji
  useEffect(() => {
    if (edytowanyProdukt) {
      ustawKategorie(edytowanyProdukt.kategoria);
      ustawBaza({
        marka: edytowanyProdukt.marka,
        model: edytowanyProdukt.model,
        cena: edytowanyProdukt.cena,
        ilosc_na_magazynie: edytowanyProdukt.ilosc_na_magazynie
      });
      ustawMeta(edytowanyProdukt.metadane || {});
    } else {
        // Reset formularza przy przełączeniu na "Dodaj nowy"
        ustawBaza({ marka: '', model: '', cena: '', ilosc_na_magazynie: '' });
        ustawMeta({});
    }
  }, [edytowanyProdukt]);

  // 2. Pobieranie słowników dla aktualnej kategorii
  useEffect(() => {
    const pobierzSlowniki = async () => {
      try {
        const res = await fetch(`/api/admin/slowniki?kategoria=${kategoria}`);
        if (res.ok) {
          ustawDostepneOpcje(await res.json());
        }
      } catch (e) {
        console.error("Błąd pobierania słowników", e);
      }
    };
    pobierzSlowniki();
  }, [kategoria]);

  const SCHEMATY = {
    aparaty: AparatyMetadaneSchema,
    obiektywy: ObiektywyMetadaneSchema,
    filmy: FilmyMetadaneSchema
  };

  const polaMeta = Object.keys(SCHEMATY[kategoria].shape);
  const handleBaza = (e) => ustawBaza({ ...baza, [e.target.name]: e.target.value });
  const handleMeta = (e) => ustawMeta({ ...meta, [e.target.name]: e.target.value });

  const wyslij = async (e) => {
    e.preventDefault();
    ustawInfo(null);
    const payload = {
      kategoria,
      ...baza,
      cena: parseFloat(baza.cena),
      ilosc_na_magazynie: parseInt(baza.ilosc_na_magazynie),
      metadane: meta
    };
    if (edytowanyProdukt) payload.id = edytowanyProdukt.id;

    const walidacja = ProductSchema.safeParse(payload);
    if (!walidacja.success) {
      // Wyświetlamy pierwszy napotkany błąd dla czytelności
      const pierwszyBlad = Object.values(walidacja.error.flatten().fieldErrors).flat()[0] || 'Błąd walidacji';
      ustawInfo({ type: 'error', msg: `Popraw dane: ${pierwszyBlad}` });
      return;
    }

    const method = edytowanyProdukt ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/produkty', {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      ustawInfo({ type: 'success', msg: edytowanyProdukt ? 'Zaktualizowano!' : 'Dodano produkt!' });
      if (!edytowanyProdukt) {
          ustawBaza({ marka: '', model: '', cena: '', ilosc_na_magazynie: '' });
          ustawMeta({});
      }
      if (poZapisaniu) poZapisaniu();
    } else {
      ustawInfo({ type: 'error', msg: 'Błąd serwera.' });
    }
  };

  // 3. Helper renderujący Select lub Input
  const renderInputMetadanych = (pole) => {
    // Sprawdzamy czy pole jest na liście słownikowej
    const czySelect = POLA_SLOWNIKOWE.includes(pole);
    
    // Filtrujemy opcje dla tego konkretnego pola (np. tylko typ_matrycy)
    const opcjePola = dostepneOpcje.filter(o => o.pole === pole);

    // Wyświetlamy select TYLKO jeśli mamy zdefiniowane opcje w bazie
    if (czySelect && opcjePola.length > 0) {
        return (
            <select
                name={pole}
                value={meta[pole] || ''}
                onChange={handleMeta}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white cursor-pointer"
                required
            >
                <option value="">-- Wybierz z listy --</option>
                {opcjePola.map(opcja => (
                    <option key={opcja.id} value={opcja.wartosc}>{opcja.wartosc}</option>
                ))}
            </select>
        );
    }

    // Fallback do zwykłego inputa (gdy brak opcji w słowniku)
    return (
        <input 
            name={pole}
            value={meta[pole] || ''}
            onChange={handleMeta}
            placeholder={czySelect ? '(Brak opcji w słowniku - wpisz ręcznie)' : ''}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
            required
        />
    );
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">
            {edytowanyProdukt ? `Edycja: ${edytowanyProdukt.marka}` : 'Dodaj nowy produkt'}
        </h2>
        
        {!edytowanyProdukt && (
            <select 
            value={kategoria} 
            onChange={(e) => { ustawKategorie(e.target.value); ustawMeta({}); }}
            className="input-primary !w-auto !py-1.5 !text-sm border-amber-300 bg-amber-50 text-amber-900 font-bold cursor-pointer"
            >
            <option value="aparaty">📷 Aparaty</option>
            <option value="obiektywy">🔍 Obiektywy</option>
            <option value="filmy">🎞️ Filmy</option>
            </select>
        )}
      </div>

      {info && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-bold flex items-center gap-2 ${info.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {info.type === 'error' ? '⚠️' : '✅'} {info.msg}
        </div>
      )}

      <form onSubmit={wyslij} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEWA KOLUMNA */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider border-b pb-2">Dane podstawowe</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Marka</label>
              <input name="marka" value={baza.marka} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Model</label>
              <input name="model" value={baza.model} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Cena (PLN)</label>
              <input type="number" step="0.01" name="cena" value={baza.cena} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Magazyn (szt.)</label>
              <input type="number" name="ilosc_na_magazynie" value={baza.ilosc_na_magazynie} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" required />
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA - SPECYFIKACJA */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-amber-600 uppercase text-xs tracking-wider">Specyfikacja: {kategoria}</h3>
              {dostepneOpcje.length === 0 && (
                  <span className="text-[10px] text-red-500 bg-white px-2 py-1 rounded border border-red-100">
                    Brak opcji w słowniku! Dodaj je w zakładce Słowniki.
                  </span>
              )}
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {polaMeta.map((pole) => (
               <div key={pole}>
                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    {pole.replace(/_/g, ' ')}
                 </label>
                 {renderInputMetadanych(pole)}
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-2 pt-6 border-t mt-2">
          <button type="submit" className="w-full bg-black text-white py-3.5 rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-[0.99]">
            {edytowanyProdukt ? 'Zapisz Zmiany' : 'Dodaj Produkt do Katalogu'}
          </button>
        </div>
      </form>
    </div>
  );
}