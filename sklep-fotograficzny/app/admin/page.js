"use client";
import { useState, useEffect } from "react";
import { uzyjUzytkownika } from "@/context/KontekstUzytkownika";
import FormularzProduktu from "./components/FormularzProduktu";
import ListaProduktow from "./components/ListaProduktow";
import ZarzadzanieSlownikami from "./components/ZarzadzanieSlownikami";

export default function AdminPage() {
  const [aktywnaZakladka, ustawAktywnaZakladke] = useState("zamowienia");
  
  // Dane list
  const [zamowienia, ustawZamowienia] = useState([]);
  const [uzytkownicy, ustawUzytkownicy] = useState([]);
  const [odswiez, ustawOdswiez] = useState(0);

  // Stan dla edycji produktu (null = tryb dodawania)
  const [edytowanyProdukt, ustawEdytowanyProdukt] = useState(null);

  // Pobieramy dane zalogowanego admina do zabezpieczeń
  const { uzytkownik: zalogowanyAdmin } = uzyjUzytkownika();

  // --- POBIERANIE DANYCH ---
  useEffect(() => {
    const pobierz = async () => {
      // Pobieramy dane tylko dla zakładek, które tego wymagają w tym widoku
      if (aktywnaZakladka === "zamowienia") {
         const res = await fetch("/api/admin/zamowienia");
         if (res.ok) ustawZamowienia(await res.json());
      } else if (aktywnaZakladka === "uzytkownicy") {
         const res = await fetch("/api/admin/uzytkownicy");
         if (res.ok) ustawUzytkownicy(await res.json());
      }
    };
    pobierz();
  }, [aktywnaZakladka, odswiez]);

  // --- AKCJE I HANDLERY ---
  const PATCH = async (url, body) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
        const err = await res.json();
        alert(err.blad || "Wystąpił błąd");
    }
    
    ustawOdswiez((v) => v + 1);
  };

  const zmienStatusZamowienia = (id, status) =>
    PATCH("/api/admin/zamowienia", { id, status });

  const zmienRoleUzytkownika = (id, rola) =>
    PATCH("/api/admin/uzytkownicy", { id, rola });

  // Obsługa przejścia do edycji produktu
  const handleEdycjaProduktu = (produkt) => {
    ustawEdytowanyProdukt(produkt);
    ustawAktywnaZakladke("formularz_produktu");
  };

  // Obsługa przejścia do dodawania nowego produktu (reset)
  const handleDodajNowy = () => {
    ustawEdytowanyProdukt(null);
    ustawAktywnaZakladke("formularz_produktu");
  };

  // Komponent linku w menu (zaktualizowany o obsługę onClick dla niestandardowych akcji)
  const MenuLink = ({ id, label, icon, onClick }) => (
    <button
      onClick={onClick || (() => ustawAktywnaZakladke(id))}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        aktywnaZakladka === id
          ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-200"
          : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      {/* LEWA KOLUMNA: Nawigacja */}
      <nav className="md:col-span-3 lg:col-span-2 sticky top-24 space-y-1">
        <MenuLink id="zamowienia" label="Zamówienia" icon="📦" />
        <MenuLink id="lista_produktow" label="Lista Produktów" icon="📋" />
        {/* Przycisk Dodaj Produkt resetuje formularz */}
        <MenuLink id="formularz_produktu" label="Dodaj Produkt" icon="➕" onClick={handleDodajNowy} />
        <MenuLink id="slowniki" label="Słowniki (Cechy)" icon="📚" />
        <MenuLink id="uzytkownicy" label="Użytkownicy" icon="👥" />
      </nav>

      {/* PRAWA KOLUMNA: Treść */}
      <section className="md:col-span-9 lg:col-span-10 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        
        {/* --- ZAMÓWIENIA --- */}
        {aktywnaZakladka === "zamowienia" && (
          <div className="p-0">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-lg font-bold text-slate-800">Lista Zamówień</h2>
               <span className="text-xs text-slate-400">Panel zarządzania</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">ID / Data</th>
                    <th className="px-6 py-3">Klient</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Kwota</th>
                    <th className="px-6 py-3 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {zamowienia.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">Brak zamówień</td></tr>
                  ) : (
                    zamowienia.map((z) => (
                      <tr key={z.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-slate-400 mb-1">#{z.id.slice(-6)}</div>
                          <div className="font-medium text-slate-700">{new Date(z.dataZamowienia).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                             {z.uzytkownik} <br/>
                             <span className="text-[10px] text-slate-400">({z.metodaPlatnosci || 'Online'})</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            z.status === "zrealizowane" ? "bg-green-100 text-green-700 border-green-200" :
                            z.status === "anulowane" ? "bg-red-100 text-red-700 border-red-200" :
                            z.status === "oplacone" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {z.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{z.sumaCalkowita.toFixed(2)} zł</td>
                        
                        <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                          {/* Przycisk podglądu zawsze widoczny */}
                          <a href={`/admin/zamowienia/${z.id}`} className="text-slate-400 hover:text-black font-medium text-xs border px-2 py-1 rounded hover:bg-white transition">
                            Szczegóły
                          </a>

                          {/* Akcje tylko dla OPŁACONYCH (czyli gotowych do realizacji) */}
                          {z.status === "oplacone" && (
                            <>
                              <button 
                                onClick={() => zmienStatusZamowienia(z.id, "w_realizacji")} 
                                className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded shadow-sm transition-colors"
                                title="Przekaż do realizacji (pakowanie)"
                              >
                                Realizuj
                              </button>
                            </>
                          )}
                          
                          {/* Dla oczekujących można np. dać opcję anuluj jeśli nie opłacone długo */}
                          {z.status === "oczekuje_na_platnosc" && (
                             <span className="text-[10px] text-slate-400 italic">Czeka na wpłatę</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 2. LISTA PRODUKTÓW (CRUD) --- */}
        {aktywnaZakladka === "lista_produktow" && (
            <ListaProduktow naEdycje={handleEdycjaProduktu} />
        )}

        {/* --- 3. FORMULARZ PRODUKTU (DODAWANIE / EDYCJA) --- */}
        {aktywnaZakladka === "formularz_produktu" && (
            <div className="p-8">
                <FormularzProduktu 
                    edytowanyProdukt={edytowanyProdukt}
                    poZapisaniu={() => ustawAktywnaZakladke("lista_produktow")}
                />
            </div>
        )}

        {/* --- 4. SŁOWNIKI --- */}
        {aktywnaZakladka === "slowniki" && (
            <ZarzadzanieSlownikami />
        )}

        {/* --- 5. UŻYTKOWNICY --- */}
        {aktywnaZakladka === "uzytkownicy" && (
          <div>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h2 className="text-lg font-bold text-slate-800">Zarządzanie Użytkownikami</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {uzytkownicy.map((u) => {
                // Sprawdzenie czy wiersz dotyczy zalogowanego admina
                const czyToJa = zalogowanyAdmin?.id === u.id;

                return (
                  <li key={u.id} className={`px-6 py-4 flex justify-between items-center ${czyToJa ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-2">
                        {u.imie}
                        {czyToJa && <span className="text-[10px] uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">(Ty)</span>}
                      </p>
                      <p className="text-sm text-slate-500 font-mono">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={u.rola}
                        disabled={czyToJa} // Zabezpieczenie frontendowe
                        onChange={(e) => zmienRoleUzytkownika(u.id, e.target.value)}
                        className={`text-sm border rounded-md shadow-sm py-1.5 pl-2 pr-8 outline-none transition-colors
                          ${czyToJa 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                            : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 focus:ring-1 focus:ring-amber-500 cursor-pointer'
                          }`}
                      >
                        <option value="uzytkownik">Użytkownik</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </section>
    </div>
  );
}