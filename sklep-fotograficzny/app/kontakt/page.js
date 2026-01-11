import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Nagłówek */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Skontaktuj się z nami
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Masz pytania dotyczące sprzętu? Nasi eksperci chętnie pomogą Ci w wyborze idealnego aparatu lub obiektywu.
          </p>
        </div>

        {/* Karty kontaktowe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Adres */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
            <p className="text-gray-600">
              ul. Migawkowa 42
              <br />
              00-123 Warszawa
            </p>
          </div>

          {/* Telefon */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="p-3 bg-green-50 rounded-full mb-4">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefon</h3>
            <p className="text-gray-600 mb-2">Infolinia:</p>
            <a 
              href="tel:+48123456789" 
              className="text-lg font-bold text-green-600 hover:underline"
            >
              +48 21 370 67 69
            </a>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="p-3 bg-purple-50 rounded-full mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-2">Napisz do nas:</p>
            <a 
              href="mailto:kontakt@example.com" 
              className="text-lg font-bold text-purple-600 hover:underline"
            >
              kontakt@example.com
            </a>
          </div>
        </div>

        {/* Sekcja Godziny otwarcia */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center justify-between border-l-4 border-blue-600">
          <div className="flex items-center mb-4 md:mb-0">
            <Clock className="w-10 h-10 text-gray-400 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Godziny otwarcia sklepu</h3>
              <p className="text-gray-500">Zapraszamy do naszego lokalu</p>
            </div>
          </div>
          <div className="text-right text-gray-700">
            <p><span className="font-semibold">Pon - Pt:</span> 9:00 - 18:00</p>
            <p><span className="font-semibold">Sobota:</span> 10:00 - 14:00</p>
            <p className="text-red-500"><span className="font-semibold">Niedziela:</span> Zamknięte</p>
          </div>
        </div>

        {/* Mapa Google */}
        <div className="mt-12 h-80 w-full bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d59603.04387752391!2d36.9450570125266!3d20.985009862183453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDAwJzM1LjEiTiAzN8KwMDAnMDYuOSJF!5e0!3m2!1spl!2spl!4v1767890070091!5m2!1spl!2spl"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa dojazdu"
            className="w-full h-full"
          ></iframe>
        </div>

      </div>
    </div>
  );
}