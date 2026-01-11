"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const KontekstUzytkownika = createContext();

export const DostawcaUzytkownika = ({ children }) => {
  const [uzytkownik, ustawUzytkownika] = useState(null);
  const [ladowanie, ustawLadowanie] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sprawdzSesje = async () => {
      try {
        const res = await fetch('/api/auth/sesja');
        const data = await res.json();
        if (data.uzytkownik) {
          ustawUzytkownika(data.uzytkownik);
        }
      } catch (error) {
        console.error("Błąd weryfikacji sesji", error);
      } finally {
        ustawLadowanie(false);
      }
    };

    sprawdzSesje();
  }, []);

  const zaloguj = async (email, haslo) => {
    const res = await fetch('/api/auth/logowanie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, haslo }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.blad || 'Błąd logowania');
    }
    
    ustawUzytkownika(data.uzytkownik);
    return data;
  };

  const zarejestruj = async (imie, email, haslo) => {
    const res = await fetch('/api/auth/rejestracja', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imie, email, haslo }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.blad || 'Błąd rejestracji');
    }
    
    return data;
  };

  const wyloguj = async () => {
    await fetch('/api/auth/wylogowanie', { method: 'POST' });
    ustawUzytkownika(null);
    router.push('/');
    router.refresh();
  };

  return (
    <KontekstUzytkownika.Provider value={{ uzytkownik, ladowanie, zaloguj, wyloguj, zarejestruj }}>
      {children}
    </KontekstUzytkownika.Provider>
  );
};

export const uzyjUzytkownika = () => useContext(KontekstUzytkownika);