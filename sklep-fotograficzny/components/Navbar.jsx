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
  const { uzytkownik, wyloguj, ladowanie } = uzyjUzytkownika();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = isMounted ? (cartItems || []).reduce((acc, item) => acc + item.quantity, 0) : 0;

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
                 <Link
                    href="/konto"
                    className="transition-colors font-medium"
                    style={{ color: 'var(--background)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
                  >
                    Konto
                 </Link>
                 <button 
                   onClick={wyloguj}
                   className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                 >
                   Wyloguj
                 </button>
              </div>
            ) : (
              <Link
                href="/logowanie"
                className="transition-colors font-medium flex items-center gap-1"
                style={{ color: 'var(--background)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--background)')}
              >
                Zaloguj się
              </Link>
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
              <>
                <Link href="/konto" onClick={() => setIsOpen(false)} className="text-lg w-full text-center py-2 hover:bg-gray-800">
                  Konto
                </Link>
                <button onClick={() => { wyloguj(); setIsOpen(false); }} className="text-red-400 text-lg w-full text-center py-2 hover:bg-gray-800">
                  Wyloguj ({uzytkownik.imie})
                </button>
              </>
          ) : (
             <Link href="/logowanie" onClick={() => setIsOpen(false)} className="text-yellow-400 text-lg w-full text-center py-2 hover:bg-gray-800">
                Zaloguj się
             </Link>
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