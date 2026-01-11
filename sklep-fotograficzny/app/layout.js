import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QueryProvider from "@/components/QueryProvider";
import { CartProvider } from "@/context/CartContext";
import { DostawcaUzytkownika } from "@/context/KontekstUzytkownika";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sklep Fotograficzny",
  description: "Z nami żadna chwila nie umknie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <QueryProvider>
          <DostawcaUzytkownika>
            <CartProvider>
              <div>
                <Navbar />
                <main className='pt-20'>
                  {children}
                </main>
                <Footer />
              </div>
            </CartProvider>
          </DostawcaUzytkownika>
        </QueryProvider>
      </body>
    </html>
  );
}



