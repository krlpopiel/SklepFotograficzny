'use client';

import { use } from 'react';
import Link from 'next/link';

export default function StronaSukcesu({ params }) {
  // W Next.js 15+ params są asynchroniczne
  const { id: idZamowienia } = use(params);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Sukces!</h1>
      <h2 className="text-xl text-gray-700 mb-6">
          Zamówienie <span className="font-mono font-bold text-blue-600">#{idZamowienia}</span> zostało opłacone.
      </h2>
      <h1 className="text-3xl font-bold mb-4">Dziękujemy za zamówienie!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Płatność została przyjęta. Potwierdzenie zamówienia wysłaliśmy na Twój adres e-mail.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
            href="/" 
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium text-center flex items-center justify-center"
        >
            Strona główna
        </Link>
        <Link 
            href="/produkty" 
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium text-center flex items-center justify-center"
        >
            Kupuj dalej
        </Link>
      </div>
    </div>
  );
}