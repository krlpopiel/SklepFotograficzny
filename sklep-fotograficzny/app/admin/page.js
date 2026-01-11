"use client";
import { useState, useEffect } from "react";
import FormularzProduktu from "./components/FormularzProduktu";

export default function AdminPage() {
  const [aktywnaZakladka, ustawAktywnaZakladke] = useState("zamowienia");
  const [zamowienia, ustawZamowienia] = useState([]);
  const [uzytkownicy, ustawUzytkownicy] = useState([]);
  const [odswiez, ustawOdswiez] = useState(0);

  // --- LOGIKA BEZ ZMIAN ---
  useEffect(() => {
    const pobierz = async () => {
      const endpoint =
        aktywnaZakladka === "zamowienia"
          ? "/api/admin/zamowienia"
          : "/api/admin/uzytkownicy";

      if (aktywnaZakladka === "produkty") return;

      const res = await fetch(endpoint);
      if (!res.ok) return;

      const dane = await res.json();
      aktywnaZakladka === "zamowienia"
        ? ustawZamowienia(dane)
        : ustawUzytkownicy(dane);
    };

    pobierz();
  }, [aktywnaZakladka, odswiez]);

  const PATCH = async (url, body) => {
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    ustawOdswiez((v) => v + 1);
  };

  const zmienStatusZamowienia = (id, status) =>
    PATCH("/api/admin/zamowienia", { id, status });

  const zmienRoleUzytkownika = (id, rola) =>
    PATCH("/api/admin/uzytkownicy", { id, rola });
  // ------------------------

  // Nowy komponent menu bocznego
  const MenuLink = ({ id, label, icon }) => (
    <button
      onClick={() => ustawAktywnaZakladke(id)}
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
      <nav className="md:col-span-3 lg:col-span-2 sticky top-24">
        <div className="space-y-1">
          <MenuLink id="zamowienia" label="Zamówienia" icon="📦" />
          <MenuLink id="produkty" label="Dodaj Produkt" icon="📷" />
          <MenuLink id="uzytkownicy" label="Użytkownicy" icon="👥" />
        </div>
      </nav>

      {/* PRAWA KOLUMNA: Treść */}
      <section className="md:col-span-9 lg:col-span-10 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        
        {/* --- ZAMÓWIENIA --- */}
        {aktywnaZakladka === "zamowienia" && (
          <div className="p-0">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-lg font-bold text-slate-800">Lista Zamówień</h2>
               <span className="text-xs text-slate-400">Ostatnia aktualizacja: teraz</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">ID / Data</th>
                    <th className="px-6 py-3">Kwota</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {zamowienia.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-400">Brak zamówień</td></tr>
                  ) : (
                    zamowienia.map((z) => (
                      <tr key={z.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-slate-400 mb-1">#{z.id.slice(-6)}</div>
                          <div className="font-medium text-slate-700">{new Date(z.dataZamowienia).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{z.sumaCalkowita.toFixed(2)} zł</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            z.status === "zrealizowane" ? "bg-green-100 text-green-800" :
                            z.status === "anulowane" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {z.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {z.status === "oczekuje_na_platnosc" && (
                            <>
                              <button onClick={() => zmienStatusZamowienia(z.id, "zrealizowane")} className="text-xs font-medium text-green-600 hover:text-green-800 border border-green-200 hover:bg-green-50 px-3 py-1 rounded transition-colors">
                                Zatwierdź
                              </button>
                              <button onClick={() => zmienStatusZamowienia(z.id, "anulowane")} className="text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-3 py-1 rounded transition-colors">
                                Odrzuć
                              </button>
                            </>
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

        {/* --- FORMULARZ PRODUKTU (Ma już swój padding) --- */}
        {aktywnaZakladka === "produkty" && (
            <div className="p-8">
                <FormularzProduktu />
            </div>
        )}

        {/* --- UŻYTKOWNICY --- */}
        {aktywnaZakladka === "uzytkownicy" && (
          <div>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h2 className="text-lg font-bold text-slate-800">Zarządzanie Użytkownikami</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {uzytkownicy.map((u) => (
                <li key={u.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-800">{u.imie}</p>
                    <p className="text-sm text-slate-500 font-mono">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={u.rola}
                      onChange={(e) => zmienRoleUzytkownika(u.id, e.target.value)}
                      className="text-sm bg-white border border-slate-300 text-slate-700 rounded-md shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 py-1.5 pl-2 pr-8 cursor-pointer outline-none"
                    >
                      <option value="uzytkownik">Użytkownik</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </section>
    </div>
  );
}