"use client";
import { useState, useEffect } from 'react';

export default function ZarzadzanieSlownikami() {
  const [opcje, ustawOpcje] = useState([]);
  const [form, ustawForm] = useState({ kategoria: 'aparaty', pole: 'typ_matrycy', wartosc: '' });
  const [info, ustawInfo] = useState(null);

  const DEFINICJE_POL = {
    aparaty: ['typ_matrycy', 'typ_baterii', 'rozdzielczosc'],
    obiektywy: ['typ_mocowania', 'typ_matrycy', 'stabilizacja'],
    filmy: ['typ', 'format', 'producent', 'czułość', 'typ_podstawy']
  };

  const pobierzOpcje = async () => {
    const res = await fetch(`/api/admin/slowniki?kategoria=${form.kategoria}`);
    if (res.ok) ustawOpcje(await res.json());
  };

  useEffect(() => {
    pobierzOpcje();
  }, [form.kategoria]);

  const dodajOpcje = async (e) => {
    e.preventDefault();
    if (!form.wartosc.trim()) return;

    const res = await fetch('/api/admin/slowniki', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      ustawInfo({ typ: 'ok', msg: 'Dodano nową opcję!' });
      ustawForm({ ...form, wartosc: '' }); 
      pobierzOpcje();
    } else {
      const err = await res.json();
      ustawInfo({ typ: 'err', msg: err.blad });
    }
  };

  const usunOpcje = async (id) => {
    ustawInfo(null);
    const res = await fetch(`/api/admin/slowniki?id=${id}`, { method: 'DELETE' });
    
    if (res.ok) {
        pobierzOpcje();
        ustawInfo({ typ: 'ok', msg: 'Opcja została usunięta.' });
    } else {
        const err = await res.json();
        ustawInfo({ typ: 'err', msg: err.blad });
    }
  };

  return (
    <div className="bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Słowniki Cech Produktów</h2>
        <p className="text-sm text-slate-500">Zdefiniuj dostępne opcje dla list rozwijanych (np. rodzaje matryc, mocowań).</p>
      </div>
      
      {/* Formularz dodawania */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
        <form onSubmit={dodajOpcje} className="flex flex-col md:flex-row gap-4 items-end">
          <div>
             <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Kategoria</label>
             <select 
               value={form.kategoria}
               onChange={e => ustawForm({
                   ...form, 
                   kategoria: e.target.value, 
                   pole: DEFINICJE_POL[e.target.value][0] 
               })}
               className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm w-full md:w-40 focus:outline-none focus:border-amber-500 font-medium"
             >
               {Object.keys(DEFINICJE_POL).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
             </select>
          </div>
          <div>
             <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Cecha (Pole)</label>
             <select 
               value={form.pole}
               onChange={e => ustawForm({...form, pole: e.target.value})}
               className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm w-full md:w-48 focus:outline-none focus:border-amber-500 font-medium"
             >
               {DEFINICJE_POL[form.kategoria].map(p => (
                   <option key={p} value={p}>{p.replace('_', ' ')}</option>
               ))}
             </select>
          </div>
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Wartość do listy</label>
             <input 
               value={form.wartosc}
               onChange={e => ustawForm({...form, wartosc: e.target.value})}
               placeholder="np. Pełna klatka, Sony E, ISO 400"
               className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-amber-500"
             />
          </div>
          <button type="submit" className="bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition shadow-sm w-full md:w-auto">
              Dodaj
          </button>
        </form>
        
        {info && (
            <div className={`mt-4 text-sm font-medium px-3 py-2 rounded ${
                info.typ === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
                {info.msg}
            </div>
        )}
      </div>

      {/* Lista opcji */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
            Zdefiniowane opcje: {form.kategoria}
        </h3>
        
        {opcje.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Brak zdefiniowanych opcji dla tej kategorii.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {opcje.map(opcja => (
                    <div key={opcja.id} className="group flex justify-between items-center bg-white border border-slate-100 p-3 rounded-lg shadow-sm hover:border-amber-300 transition-colors">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                                {opcja.pole.replace('_', ' ')}
                            </span>
                            <span className="font-semibold text-slate-700">{opcja.wartosc}</span>
                        </div>
                        <button 
                            onClick={() => usunOpcje(opcja.id)}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                            title="Usuń (jeśli nieużywane)"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}