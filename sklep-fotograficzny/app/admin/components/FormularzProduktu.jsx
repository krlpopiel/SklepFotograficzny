"use client";
import { useState } from 'react';
import { ProductSchema, AparatyMetadaneSchema, FilmyMetadaneSchema, ObiektywyMetadaneSchema } from '@/lib/validators';

export default function FormularzProduktu() {
  const [kategoria, ustawKategorie] = useState('aparaty');
  const [baza, ustawBaza] = useState({ marka: '', model: '', cena: '', ilosc_na_magazynie: '' });
  const [meta, ustawMeta] = useState({});
  const [info, ustawInfo] = useState(null);

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

    const walidacja = ProductSchema.safeParse(payload);
    if (!walidacja.success) {
      ustawInfo({ type: 'error', msg: 'Sprawdź poprawność danych (wymagane pola).' });
      return;
    }

    try {
        const res = await fetch('/api/admin/produkty', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
        });

        if (res.ok) {
        ustawInfo({ type: 'success', msg: 'Produkt został dodany pomyślnie!' });
        ustawBaza({ marka: '', model: '', cena: '', ilosc_na_magazynie: '' });
        ustawMeta({});
        } else {
        ustawInfo({ type: 'error', msg: 'Wystąpił błąd serwera.' });
        }
    } catch (err) {
        ustawInfo({ type: 'error', msg: 'Błąd połączenia.' });
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Nowy Produkt</h2>
           <p className="text-sm text-slate-500">Uzupełnij specyfikację techniczną.</p>
        </div>
        
        {/* Wybór kategorii */}
        <select 
          value={kategoria} 
          onChange={(e) => { ustawKategorie(e.target.value); ustawMeta({}); }}
          className="border-2 border-amber-100 bg-amber-50 text-amber-900 font-bold text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="aparaty">📷 Aparaty</option>
          <option value="obiektywy">🔍 Obiektywy</option>
          <option value="filmy">🎞️ Filmy</option>
        </select>
      </div>

      {info && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium flex items-center gap-2 ${info.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {info.type === 'error' ? '⚠️' : '✅'} {info.msg}
        </div>
      )}

      <form onSubmit={wyslij} className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
        
        {/* LEWA KOLUMNA: DANE PODSTAWOWE */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider border-b pb-2">Dane handlowe</h3>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Marka</label>
              <input name="marka" value={baza.marka} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" placeholder="np. Canon" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Model</label>
              <input name="model" value={baza.model} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" placeholder="np. AE-1" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cena (PLN)</label>
              <input type="number" step="0.01" name="cena" value={baza.cena} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Stan (szt.)</label>
              <input type="number" name="ilosc_na_magazynie" value={baza.ilosc_na_magazynie} onChange={handleBaza} className="input-primary w-full bg-slate-50 focus:bg-white" placeholder="0" required />
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: SPECYFIKACJA */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Specyfikacja techniczna</h3>
              <span className="text-[10px] font-mono bg-white border px-2 rounded text-slate-400 uppercase">{kategoria}</span>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {polaMeta.map((pole) => (
               <div key={pole}>
                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                   {pole.replace(/_/g, ' ')}
                 </label>
                 <input 
                   name={pole}
                   value={meta[pole] || ''}
                   onChange={handleMeta}
                   className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white transition-all"
                   required
                 />
               </div>
             ))}
           </div>
        </div>

        <div className="xl:col-span-2 pt-4">
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99]">
            Dodaj Produkt do Katalogu
          </button>
        </div>
      </form>
    </div>
  );
}