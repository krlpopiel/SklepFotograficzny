"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function KoszykPage() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    updateItemQuantity, 
    removeItemCompletely 
  } = useCart();

  const handleQuantityBlur = (productId, value) => {
    const quantity = parseInt(value, 10);
    updateItemQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId, productName) => {
    if (window.confirm(`Czy na pewno chcesz usunąć ${productName} z koszyka?`)) {
      removeItemCompletely(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Czy na pewno chcesz wyczyścić cały koszyk?")) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="p-6 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Twój koszyk jest pusty</h1>
        <Link href="/produkty" className="btn-primary">
          Wróć do sklepu
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Twój Koszyk</h1>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="hidden md:grid grid-cols-5 gap-4 border-b pb-4 mb-4 font-semibold">
          <div className="col-span-2">Produkt</div>
          <div className="text-center">Cena</div>
          <div className="text-center">Ilość</div>
          <div className="text-right">Suma</div>
        </div>

        {cartItems.map((item) => (
          <div
            key={item.id} 
            className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center border-b py-4"
          >
            <div className="col-span-2">
              <p className="font-semibold text-lg">{item.marka} {item.model}</p>
              <p className="text-sm text-gray-600 md:hidden">
                {item.cena.toFixed(2)} zł
              </p>
            </div>

            <div className="hidden md:block text-center">
              {item.cena.toFixed(2)} zł
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  disabled={item.quantity <= 1}
                  className={`rounded-full w-8 h-8 font-bold flex items-center justify-center transition
                    ${item.quantity <= 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
                    }`}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => handleQuantityBlur(item.id, e.target.value)}
                  className="input-primary text-center"
                  style={{ maxWidth: '80px', padding: '0.5rem' }} 
                />
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id, `${item.marka} ${item.model}`)}
                className="text-sm text-red-500 hover:underline mt-2"
              >
                Usuń
              </button>
            </div>

            <div className="text-right font-bold text-lg">
              {(item.cena * item.quantity).toFixed(2)} zł
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <button
            onClick={handleClearCart} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-4 md:mb-0"
          >
            Wyczyść koszyk
          </button>
          <div className="text-right">
            <h3 className="text-2xl font-bold">
              Łącznie: {getCartTotal()} zł
            </h3>
            <Link href="/kasa" className="btn-primary inline-block mt-4">
              Przejdź do kasy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}