import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
       <body>
        <Navbar />
        <main className='pt-20'>{children}</main>
        <Footer />
        </body>
    </html>
  )
}