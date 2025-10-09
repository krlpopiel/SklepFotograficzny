'use client';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  // Pokazuj przycisk dopiero po przewinięciu w dół
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowButton(true);
      else setShowButton(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="text-center py-6 mt-10 relative" style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)',
      }}>
      <p className="text-sm">Sklep Fotograficzny - Nie istniejemy tak naprawdę!!!</p>

      {/* Przycisk "Powrót na górę" */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 px-4 py-2 rounded-full shadow-lg transition-all duration-300" style={{backgroundColor: 'var(--color-accent)',color:'var(--foreground)'}} 
          onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--color-accent)')
            }
        >
          ↑ Powrót
        </button>
      )}
    </footer>
  );
}
