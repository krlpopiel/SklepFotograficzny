'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="hidden md:flex space-x-6">
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
        </div>

        {/* Menu mobilne */}
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
        </div>
      )}
    </nav>
  );
}
