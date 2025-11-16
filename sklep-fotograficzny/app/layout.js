import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
       <body>
        <CartProvider> 
          <Navbar />
          <main className='pt-20'>{children}</main>
          <Footer />
        </CartProvider>
        </body>
    </html>
  )
}