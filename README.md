# Sklep Fotograficzny

<div align="center">

![Status Projektu](https://img.shields.io/badge/Status-Ukończony-success?style=for-the-badge)
![Wersja](https://img.shields.io/badge/Wersja-1.0.0-blue?style=for-the-badge)
![Licencja](https://img.shields.io/badge/Licencja-MIT-yellow?style=for-the-badge)

**Nowoczesna platforma e-commerce dla entuzjastów fotografii.**
Kompleksowa aplikacja webowa umożliwiająca zakup aparatów, obiektywów i akcesoriów, wyposażona w zaawansowany panel administracyjny.

[Demo (Live Preview)](#) · [Zgłoś Błąd](issues) · [Prośba o funkcję](issues)

</div>

---

## 📝 O Projekcie

Projekt **Sklep Fotograficzny** to aplikacja typu Full-Stack E-commerce stworzona jako projekt zaliczeniowy. Głównym celem było stworzenie responsywnego, szybkiego i skalowalnego sklepu internetowego wykorzystując najnowsze standardy webowe (Next.js 15, Server Actions, Prisma ORM).

Aplikacja obsługuje pełną ścieżkę zakupową klienta oraz posiada rozbudowany panel CMS dla administratora do zarządzania asortymentem i zamówieniami.

### ✨ Główne Funkcjonalności

#### 👤 Dla Użytkownika (Klienta)
- **Katalog Produktów:** Przeglądanie aparatów, obiektywów i filmów z filtrowaniem.
- **Szczegóły Produktu:** Dynamiczne wyświetlanie specyfikacji technicznej w zależności od kategorii.
- **Koszyk Zakupowy:** Dodawanie, usuwanie i zmiana ilości produktów (Context API).
- **Proces Zakupowy (Checkout):** Wybór metody dostawy i płatności (symulacja bramki płatniczej).
- **Konto Użytkownika:** Historia zamówień, podgląd szczegółów i statusów.
- **Autoryzacja:** Rejestracja i logowanie (JWT).

#### 🛡️ Dla Administratora
- **Dashboard:** Przegląd ostatnich zamówień i statystyk.
- **Zarządzanie Zamówieniami:** Zmiana statusów (Oczekuje -> Opłacone -> Wysłane), anulowanie zamówień ze zwrotem towaru na stan.
- **CRUD Produktów:** Dodawanie i edycja produktów z dynamicznymi formularzami (zależnymi od kategorii).
- **Zarządzanie Słownikami:** Definiowanie cech produktów (np. typy matryc, mocowania) dla list rozwijanych.
- **Użytkownicy:** Zarządzanie rolami użytkowników.

---

## 🛠️ Technologie

Projekt został zbudowany w oparciu o nowoczesny stos technologiczny (Tech Stack):

### Frontend & Backend (Next.js)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Baza Danych i ORM
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### Narzędzia i Biblioteki
- **Zod:** Walidacja danych wejściowych (frontend i backend).
- **Jose:** Obsługa tokenów JWT (Json Web Tokens) na krawędzi (Edge compatible).
- **React Context:** Zarządzanie stanem globalnym (koszyk, użytkownik).

---

## 🚀 Instalacja i Uruchomienie

Aby uruchomić projekt lokalnie, postępuj zgodnie z poniższymi krokami:

### 1. Klonowanie repozytorium

git clone [https://github.com/twoj-nick/sklep-fotograficzny.git](https://github.com/twoj-nick/sklep-fotograficzny.git)
cd sklep-fotograficzny

### 2. Instalacja zależności

npm install

### 3. Konfiguracja zmiennych środowiskowych
Utwórz plik .env w głównym katalogu projektu i uzupełnij go o swoje dane:

Fragment kodu

# Połączenie do bazy MongoDB
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/sklep-db?retryWrites=true&w=majority"

# Sekret do podpisywania tokenów JWT
JWT_SECRET="twoj-bardzo-tajny-i-dlugi-klucz"

### 4. Konfiguracja Bazy Danych (Prisma)
Wygeneruj klienta Prisma i wypchnij schemat do bazy danych:


npx prisma generate
npx prisma db push

### 5. (Opcjonalnie) Seedowanie Bazy Danych
Aby wypełnić bazę przykładowymi produktami i słownikami:


node prisma/seed.js
# lub jeśli dodałeś skrypt do package.json:
npm run seed
#

