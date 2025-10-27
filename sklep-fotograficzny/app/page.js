import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero section */}
      <section className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Witamy w <span className="text-[var(--primary)]">Sklepie Fotograficznym</span>!
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8">
          Odkryj świat fotografii z nami – od klasycznych aparatów po nowoczesne obiektywy i filmy 35mm.
        </p>

        <Link
          href="/produkty"
          className="btn-primary inline-block text-lg font-semibold"
        >
          Zobacz produkty
        </Link>
      </section>

      {/* Kategorie / Highlights */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-3 text-[var(--primary)]">
            📷 Aparaty
          </h2>
          <p className="text-gray-600 mb-4">
            Od kultowych analogów po nowoczesne bezlusterkowce.
          </p>
          <Link href="/produkty" className="text-[var(--color-link)] hover:underline">
            Przeglądaj →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-3 text-[var(--primary)]">
            🔭 Obiektywy
          </h2>
          <p className="text-gray-600 mb-4">
            Znajdź idealne szkło do swojego aparatu.
          </p>
          <Link href="/produkty" className="text-[var(--color-link)] hover:underline">
            Przeglądaj →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-3 text-[var(--primary)]">
            🎞️ Filmy 35mm
          </h2>
          <p className="text-gray-600 mb-4">
            Klasyczna fotografia analogowa w najlepszym wydaniu.
          </p>
          <Link href="/produkty" className="text-[var(--color-link)] hover:underline">
            Przeglądaj →
          </Link>
        </div>
      </section>
    </main>
  );
}
