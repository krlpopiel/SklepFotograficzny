'use client';

import { useState } from 'react';
import { uzyjUzytkownika } from '@/context/KontekstUzytkownika';
import { useRouter } from 'next/navigation';

export default function StronaLogowania() {
  const { zaloguj, zarejestruj } = uzyjUzytkownika();
  const router = useRouter();

  const [trybRejestracji, ustawTrybRejestracji] = useState(false);
  const [daneFormularza, ustawDaneFormularza] = useState({
    imie: '',
    email: '',
    haslo: ''
  });

  const [blad, ustawBlad] = useState('');
  const [ladowanie, ustawLadowanie] = useState(false);

  const obsluzZmianeInputa = (e) => {
    const { name, value } = e.target;
    ustawDaneFormularza((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const obsluzSubmit = async (e) => {
    e.preventDefault();
    ustawLadowanie(true);
    ustawBlad('');

    try {
      if (trybRejestracji) {
        await zarejestruj(daneFormularza.imie, daneFormularza.email, daneFormularza.haslo);
        await zaloguj(daneFormularza.email, daneFormularza.haslo);
      } else {
        await zaloguj(daneFormularza.email, daneFormularza.haslo);
      }
      
      router.push('/');
      router.refresh();

    } catch (err) {
      ustawBlad(err.message || 'Wystąpił błąd podczas logowania/rejestracji.');
    } finally {
      ustawLadowanie(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Kontener formularza wzorowany na Twoim snippecie */}
      <div className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-xl p-8 border border-gray-200">
        
        <h3 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800 text-center">
          {trybRejestracji ? 'Załóż konto' : 'Zaloguj się'}
        </h3>
        
        {blad && (
          <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-200 text-center">
            {blad}
          </div>
        )}

        <form onSubmit={obsluzSubmit} className="flex flex-col gap-4">
          {trybRejestracji && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
              <input
                type="text"
                name="imie"
                placeholder="Twoje imię"
                className="w-full border border-gray-300 p-3 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
                value={daneFormularza.imie}
                onChange={obsluzZmianeInputa}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Adres email"
              className="w-full border border-gray-300 p-3 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
              value={daneFormularza.email}
              onChange={obsluzZmianeInputa}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
            <input
              type="password"
              name="haslo"
              placeholder="Hasło"
              className="w-full border border-gray-300 p-3 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
              value={daneFormularza.haslo}
              onChange={obsluzZmianeInputa}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={ladowanie}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded transition shadow-md hover:shadow-lg active:scale-95 mt-2 ${
              ladowanie ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {ladowanie 
              ? 'Przetwarzanie...' 
              : (trybRejestracji ? 'Zarejestruj się' : 'Zaloguj się')
            }
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {trybRejestracji ? 'Masz już konto?' : 'Nie masz konta?'}
          <button 
            type="button"
            onClick={() => {
              ustawTrybRejestracji(!trybRejestracji);
              ustawBlad('');
              ustawDaneFormularza({ imie: '', email: '', haslo: '' });
            }}
            className="text-blue-600 hover:text-blue-800 ml-1 font-semibold underline decoration-blue-300 hover:decoration-blue-800 transition-colors"
          >
             {trybRejestracji ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </div>
      </div>
    </div>
  );
}