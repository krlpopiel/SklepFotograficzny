"use client";
import { uzyjUzytkownika } from "@/context/KontekstUzytkownika";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { uzytkownik, ladowanie } = uzyjUzytkownika();
  const router = useRouter();

  useEffect(() => {
    if (!ladowanie) {
      if (!uzytkownik || uzytkownik.rola !== "admin") {
        router.push("/");
      }
    }
  }, [uzytkownik, ladowanie, router]);

  if (ladowanie || !uzytkownik) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
           <span>Weryfikacja uprawnień...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Prosty, biały Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
           <h1 className="text-xl font-bold tracking-tight text-slate-800">
             Panel Administratora
           </h1>
        </div>
        <div className="text-sm text-slate-500">
           Zalogowany jako: <span className="font-semibold text-slate-800">{uzytkownik.imie}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}