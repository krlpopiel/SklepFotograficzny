"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center text-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero section */}
      <section
        className="relative w-full flex flex-col items-center justify-center py-24 sm:py-32"
        style={{
          background: `linear-gradient(rgba(248,250,252,0.95), rgba(248,250,252,0.95)), url('/hero-bg.jpg') center/cover no-repeat`,
          backgroundPositionY: `${scrollY * 0.3}px`, // parallax
        }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Witamy w <span className="text-[var(--primary)]">Sklepie Fotograficznym</span>!
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Odkryj świat fotografii z nami – od klasycznych aparatów po nowoczesne
          obiektywy i filmy 35mm.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/produkty"
            className="btn-primary inline-block text-lg font-semibold shadow-md hover:shadow-lg"
          >
            Zobacz produkty
          </Link>
        </motion.div>
      </section>

      {/* Kategorie */}
      <motion.section
        className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        variants={{
          hidden: {},
          visible: {},
        }}
      >
        {[
          {
            title: "Aparaty",
            desc: "Od tradycyjnych lusterkowców po nowoczesne bezlusterkowce.",
          },
          {
            title: "Obiektywy",
            desc: "Znajdź idealne szkło do swojego aparatu.",
          },
          {
            title: "Filmy 35mm",
            desc: "Klasyczna fotografia analogowa w najlepszym wydaniu.",
          },
        ].map((k, i) => (
          <motion.div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-3 text-[var(--primary)]">
              {k.title}
            </h2>
            <p className="text-gray-600 mb-4">{k.desc}</p>
            <Link
              href="/produkty"
              className="text-[var(--color-link)] hover:underline"
            >
              Przeglądaj →
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
