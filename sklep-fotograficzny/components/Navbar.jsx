'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className="fixed top-0 left-0 w-full shadow-lg z-50"
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold"
          style={{ color: 'var(--color-accent)' }}
        >
          <Image src="/logo.png" alt="Logo sklepu" width={40} height={40} />
          <h5 className="text-lg md:text-xl">Sklep Fotograficzny</h5>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/"
            className="transition-colors"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--background)')
            }
          >
            Strona główna
          </Link>
          <Link
            href="/produkty"
            className="transition-colors"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--background)')
            }
          >
            Produkty
          </Link>
          <Link
            href="/kontakt"
            className="transition-colors"
            style={{ color: 'var(--background)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--background)')
            }
          >
            Kontakt
          </Link>
          <Link
            href="/koszyk"
            className="transition-colors relative px-3 py-2 rounded-md" 
            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary)')
            }
          >
            Koszyk
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Menu mobilne - przycisk */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: 'var(--primary)' }}
        >
          ☰
        </button>
      </div>

      {/* Dropdown menu dla telefonu */}
      {isOpen && (
        <div
          className="md:hidden flex flex-col items-center space-y-3 py-3"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
        >
          <Link href="/" onClick={() => setIsOpen(false)}>
            Strona główna
          </Link>
          <Link href="/produkty" onClick={() => setIsOpen(false)}>
            Produkty
          </Link>
          <Link href="/kontakt" onClick={() => setIsOpen(false)}>
            Kontakt
          </Link>
          <Link href="/koszyk" onClick={() => setIsOpen(false)} className="relative">
            Koszyk
            {totalItems > 0 && (
               <span className="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}