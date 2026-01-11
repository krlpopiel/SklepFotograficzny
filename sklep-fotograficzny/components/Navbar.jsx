'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { uzyjUzytkownika } from '@/context/KontekstUzytkownika';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); 
  
  const { cartItems } = useCart();
  
  const { uzytkownik, zaloguj, wyloguj, zarejestruj, ladowanie } = uzyjUzytkownika();

  const [czyFormularzOtwarty, ustawCzyFormularzOtwarty] = useState(false);
  const [trybRejestracji, ustawTrybRejestracji] = useState(false);
  const [daneFormularza, ustawDaneFormularza] = useState({ imie: '', email: '', haslo: '' });
  const [blad, ustawBlad] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = isMounted ? (cartItems || []).reduce((acc, item) => acc + item.quantity, 0) : 0;

  const obsluzZmianeInputa = (e) => {
    ustawDaneFormularza({ ...daneFormularza, [e.target.name]: e.target.value });
  };

  const obsluzSubmit = async (e) => {
    e.preventDefault();
    ustawBlad('');
    try {
      if (trybRejestracji) {
        await zarejestruj(daneFormularza.imie, daneFormularza.email, daneFormularza.haslo);
        ustawTrybRejestracji(false);
        ustawBlad('Konto utworzone! Zaloguj się.');
      } else {
        await zaloguj(daneFormularza.email, daneFormularza.haslo);
        ustawCzyFormularzOtwarty(false);
      }
    } catch (err) {
      ustawBlad(err.message);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full shadow-lg z-50 transition-all duration-300"
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16 relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-accent)' }}
        >
          <div className="relative w-10 h-10">
             <Image src="/logo.png" alt="Logo sklepu" fill className="object-contain" />
          </div>
          <h5 className="text-lg md:text-xl hidden sm:block">Sklep Fotograficzny</h5>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/"
            className="transition-colors font-medium"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
          >
            Strona główna
          </Link>
          <Link
            href="/produkty"
            className="transition-colors font-medium"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
          >
            Produkty
          </Link>
          <Link
            href="/kontakt"
            className="transition-colors font-medium"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
          >
            Kontakt
          </Link>

          {/* Sekcja Użytkownika */}
          <div className="relative">
            {!ladowanie && uzytkownik ? (
              <div className="flex items-center gap-3">
                 <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{uzytkownik.imie}</span>
                 <button 
                   onClick={wyloguj}
                   className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                 >
                   Wyloguj
                 </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => ustawCzyFormularzOtwarty(!czyFormularzOtwarty)}
                  className="transition-colors font-medium flex items-center gap-1"
                  style={{ color: 'var(--background)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
                >
                  Konto
                </button>

                {/* Dropdown Formularza */}
                {czyFormularzOtwarty && (
                  <div className="absolute right-0 mt-4 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-5 border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
                      {trybRejestracji ? 'Załóż konto' : 'Zaloguj się'}
                    </h3>
                    
                    {blad && <div className="text-red-600 text-xs mb-3 bg-red-50 p-2 rounded border border-red-200">{blad}</div>}

                    <form onSubmit={obsluzSubmit} className="flex flex-col gap-4">
                      {trybRejestracji && (
                        <div>
                          <input
                            type="text"
                            name="imie"
                            placeholder="Twoje imię"
                            className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
                            value={daneFormularza.imie}
                            onChange={obsluzZmianeInputa}
                            required
                          />
                        </div>
                      )}
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Adres email"
                          className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
                          value={daneFormularza.email}
                          onChange={obsluzZmianeInputa}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          name="haslo"
                          placeholder="Hasło"
                          className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-gray-50 text-black transition-all"
                          value={daneFormularza.haslo}
                          onChange={obsluzZmianeInputa}
                          required
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition shadow-md hover:shadow-lg active:scale-95"
                      >
                        {trybRejestracji ? 'Zarejestruj się' : 'Zaloguj się'}
                      </button>
                    </form>

                    <div className="mt-4 text-center text-xs text-gray-500">
                      {trybRejestracji ? 'Masz już konto?' : 'Nie masz konta?'}
                      <button 
                        onClick={() => {
                          ustawTrybRejestracji(!trybRejestracji);
                          ustawBlad('');
                        }}
                        className="text-blue-600 hover:text-blue-800 ml-1 font-semibold underline decoration-blue-300 hover:decoration-blue-800"
                      >
                         {trybRejestracji ? 'Zaloguj się' : 'Zarejestruj się'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href="/koszyk"
            className="transition-transform active:scale-95 relative px-4 py-2 rounded-md font-bold flex items-center gap-2"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary)')
            }
          >
            <span>Koszyk</span>
            {isMounted && totalItems > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Menu mobilne - przycisk */}
        <button
          className="md:hidden focus:outline-none text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: 'var(--primary)' }}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Dropdown menu dla telefonu */}
      {isOpen && (
        <div
          className="md:hidden flex flex-col items-center space-y-4 py-6 shadow-inner absolute w-full left-0 top-16 border-t border-gray-700"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
        >
          <Link href="/" onClick={() => setIsOpen(false)} className="text-lg w-full text-center py-2 hover:bg-gray-800">
            Strona główna
          </Link>
          <Link href="/produkty" onClick={() => setIsOpen(false)} className="text-lg w-full text-center py-2 hover:bg-gray-800">
            Produkty
          </Link>
          <Link href="/kontakt" onClick={() => setIsOpen(false)} className="text-lg w-full text-center py-2 hover:bg-gray-800">
            Kontakt
          </Link>
          
          {/* Mobilne logowanie/wylogowanie */}
          {!ladowanie && uzytkownik ? (
              <button onClick={() => { wyloguj(); setIsOpen(false); }} className="text-red-400 text-lg w-full text-center py-2 hover:bg-gray-800">
                Wyloguj ({uzytkownik.imie})
              </button>
          ) : (
             <button onClick={() => { ustawCzyFormularzOtwarty(true); setIsOpen(false); }} className="text-yellow-400 text-lg w-full text-center py-2 hover:bg-gray-800">
                Zaloguj się
             </button>
          )}

          <Link href="/koszyk" onClick={() => setIsOpen(false)} className="relative font-bold text-lg w-full text-center py-2 hover:bg-gray-800 flex justify-center items-center gap-2" style={{ color: 'var(--primary)' }}>
            Koszyk 
            {isMounted && totalItems > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}