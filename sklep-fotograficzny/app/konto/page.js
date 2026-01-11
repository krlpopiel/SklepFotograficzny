"use client";
import { uzyjUzytkownika } from '@/context/KontekstUzytkownika';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function KontoPage() {
  const { uzytkownik, ladowanie } = uzyjUzytkownika();
  const router = useRouter();
  const [zamowienia, ustawZamowienia] = useState([]);
  const [ladujeZamowienia, ustawLadujeZamowienia] = useState(true);

  useEffect(() => {
    if (!ladowanie && !uzytkownik) {
      router.push('/logowanie');
    }
  }, [uzytkownik, ladowanie, router]);

  useEffect(() => {
    if (uzytkownik) {
        fetch('/api/moje-zamowienia')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) ustawZamowienia(data);
                ustawLadujeZamowienia(false);
            })
            .catch(() => ustawLadujeZamowienia(false));
    }
  }, [uzytkownik]);

  if (ladowanie || !uzytkownik) {
    return <div className="p-10 text-center">Weryfikacja...</div>;
  }

  const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        status === 'zrealizowane' ? 'bg-green-100 text-green-700' :
        status === 'anulowane' ? 'bg-red-100 text-red-700' :
        status === 'oplacone' ? 'bg-blue-100 text-blue-700' :
        'bg-yellow-100 text-yellow-800'
    }`}>
        {status.replace(/_/g, ' ')}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Karta Użytkownika */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Witaj, {uzytkownik.imie}!</h1>
          <p className="text-slate-500">Zalogowano jako: <span className="font-mono text-slate-700">{uzytkownik.email}</span></p>
          {uzytkownik.rola === 'admin' && (
              <div className="mt-4">
                  <Link href="/admin" className="text-sm font-bold bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                      Przejdź do Panelu Administratora
                  </Link>
              </div>
          )}
        </div>

        {/* Sekcja Zamówień */}
        <h2 className="text-xl font-bold text-slate-800 mb-4 ml-1">Twoje ostatnie zamówienia</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {ladujeZamowienia ? (
                <div className="p-8 text-center text-slate-400">Ładowanie historii...</div>
            ) : zamowienia.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-slate-500 mb-4">Nie masz jeszcze żadnych zamówień.</p>
                    <Link href="/produkty" className="text-amber-600 font-bold hover:underline">
                        Rozpocznij zakupy →
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="p-4">Nr Zamówienia</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Kwota</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Akcja</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {zamowienia.map(z => (
                                <tr key={z.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono text-xs text-slate-500">#{z.id.slice(-6)}</td>
                                    <td className="p-4 text-slate-700">{new Date(z.dataZamowienia).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-slate-900">{z.sumaCalkowita.toFixed(2)} zł</td>
                                    <td className="p-4"><StatusBadge status={z.status} /></td>
                                    <td className="p-4 text-right flex justify-end items-center gap-3">
                                        {/* --- NOWOŚĆ: Przycisk Zapłać --- */}
                                        {z.status === 'oczekuje_na_platnosc' && (
                                            <Link 
                                                href={`/platnosc/${z.id}`}
                                                className="bg-black-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm"
                                            >
                                                Zapłać teraz
                                            </Link>
                                        )}
                                        
                                        <Link 
                                            href={`/konto/zamowienia/${z.id}`}
                                            className="text-slate-500 hover:text-black font-medium hover:underline"
                                        >
                                            Szczegóły
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}