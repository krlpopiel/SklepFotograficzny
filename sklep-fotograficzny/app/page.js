import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* --- Sekcja HERO --- */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10 animate-in slide-in-from-bottom-5 duration-700">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                Uchwyć każdą chwilę <br className="hidden lg:block" />
                <span className="text-yellow-500">w idealnej jakości.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Najlepszy sprzęt fotograficzny dla profesjonalistów i pasjonatów. 
                Aparaty, obiektywy i akcesoria, które pozwolą Ci rozwinąć skrzydła.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/produkty" 
                  className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  Zobacz ofertę
                </Link>
                <Link 
                  href="/kontakt" 
                  className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center"
                >
                  Skontaktuj się
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-yellow-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
              
              <div className="relative w-full max-w-lg aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                    <Image 
                      src="/hero-bg.png" 
                      alt="Sprzęt fotograficzny" 
                      fill 
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                    />
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* --- Sekcja "Dlaczego my?" (Grid) --- */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Dlaczego warto nas wybrać?</h2>
            <p className="mt-4 text-lg text-gray-600">Twój zaufany partner w świecie fotografii.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Kafel 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-3xl mb-6">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Szybka wysyłka</h3>
              <p className="text-gray-600">
                Zamówienia złożone do godziny 14:00 wysyłamy tego samego dnia. Twój sprzęt dotrze do Ciebie błyskawicznie.
              </p>
            </div>

            {/* Kafel 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gwarancja jakości</h3>
              <p className="text-gray-600">
                Oferujemy tylko oryginalny sprzęt od autoryzowanych dystrybutorów. Pełna gwarancja producenta na każdy produkt.
              </p>
            </div>

            {/* Kafel 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                💡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fachowe doradztwo</h3>
              <p className="text-gray-600">
                Nie wiesz co wybrać? Nasz zespół ekspertów pomoże Ci dopasować sprzęt idealnie do Twoich potrzeb.
              </p>
            </div>
          </div>
        </div>
      </section>

      

    </main>
  );
}