# 📷Sklep Fotograficzny

<div align="center">

**Modern e-commerce platform for photography enthusiasts.**
A comprehensive web application for purchasing cameras, lenses, and accessories, equipped with an advanced administration panel.

**Website URL** - [Sklep Fotograficzny](https://sklep-fotograficzny.vercel.app/)

</div>

---

## 📝 About the Project

The **Sklep Fotograficzny** project is a Full-Stack E-commerce application created as a final/capstone project. The main goal was to create a responsive, fast, and scalable online store using the latest web standards (Next.js 15, Server Actions, Prisma ORM).

The application handles the full customer purchase journey and features an extensive CMS panel for the administrator to manage the inventory and orders.

### ✨ Key Features

#### 👤 For the User (Customer)

* **Product Catalog:** Browse cameras, lenses, and films with filtering.
* **Product Details:** Dynamic display of technical specifications depending on the category.
* **Shopping Cart:** Adding, removing, and changing product quantities (Context API).
* **Checkout Process:** Selection of delivery and payment methods (payment gateway simulation).
* **User Account:** Order history, viewing details and statuses.
* **Authorization:** Registration and login (JWT).

#### 🛡️ For the Administrator

* **Dashboard:** Overview of recent orders and statistics.
* **Order Management:** Changing statuses (Pending -> Paid -> Shipped), cancelling orders with stock return.
* **Product CRUD:** Adding and editing products with dynamic forms (dependent on category).
* **Dictionary Management:** Defining product attributes (e.g., sensor types, mounts) for dropdown lists.
* **Users:** Managing user roles.

---

## 🛠️ Technologies

The project was built using a modern Tech Stack:

### Frontend & Backend (Next.js)

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)



### Database and ORM

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

* **Zod:** Input data validation (frontend and backend).
* **Jose:** JWT (Json Web Tokens) handling on the Edge.
* **React Context:** Global state management (cart, user).

---

## 🚀 Installation and Setup

To run the project locally, follow the steps below:

### 1. Clone the repository

```bash
git clone [https://github.com/twoj-nick/sklep-fotograficzny.git](https://github.com/twoj-nick/sklep-fotograficzny.git)
cd sklep-fotograficzny

```

### 2. Install dependencies

```bash
npm install

```

### 3. Environment variables configuration

Create a `.env` file in the main project directory and fill it with your data:

```env
# MongoDB database connection
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/sklep-db?retryWrites=true&w=majority"

# Secret for signing JWT tokens
JWT_SECRET="your-very-secret-and-long-key"

```

### 4. Database Configuration (Prisma)

Generate the Prisma client and push the schema to the database:

```bash
npx prisma generate
npx prisma db push

```

### 5. (Optional) Database Seeding

To populate the database with example products and dictionaries:

```bash
node prisma/seed.js
# or if you added the script to package.json:
npm run seed

```
