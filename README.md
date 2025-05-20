![image](https://github.com/Mehdi-Zarei/Foodino/raw/57de1f5d4847f29067a0e861f1cebd8521214171/public/images/No-time.png.jpg)

# 🍽️ Foodino - Backend for Online Café Restaurant

Welcome to **Foodino**, a fully modular and scalable backend project for an online café-restaurant 🥗☕ built with **TypeScript** and **Express.js**. This backend serves a full e-commerce system where users can order both food and drinks, authenticate via OTP or password, and pay online using **Zarinpal** 🧾.

---

## 🚀 Features

- 🔐 **Authentication with OTP**  
  Users can log in or sign up using a one-time password sent via SMS. If a user already exists, they are logged in; otherwise, they need to fill in their details.

- 🔐 **Password Login & JWT System**  
  Users can also log in via email/password. Access tokens are valid for **15 minutes**, and refresh tokens are valid for **30 days**, stored securely in **Redis** after hashing.  
  On logout, the refresh token is removed from the user’s cookies.

- 🛡️ **AuthGuard Middleware**  
  A powerful middleware that:

  - Verifies access tokens 🔑
  - Detects the user’s role (e.g., admin check) 👮
  - Allows flexible usage for both authorization and basic user identification

- 🧠 **Global Error Handler**  
  Captures and returns:

  - General application errors
  - Detailed validation errors powered by **Zod** 🧾

- 🛒 **Shopping Cart + Checkout Flow**

  - Items added to cart
  - Before payment, checks if items are still in stock and removes unavailable ones automatically 🧹
  - If payment is successful:
    - Cart is cleared
    - Checkout document is deleted
    - A new Order document is created ✅

- 💳 **Zarinpal Payment Integration**  
   Payment is done via Zarinpal.  
   MongoDB transactions are used to verify the payment.  
   ⚠️ Make sure MongoDB is configured for transactions; otherwise, payment logic may fail or crash the app.
  ## 🗄️ Database & Replica Set Warning
  Transactions only work if your MongoDB instance is in replica set mode:

```js
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }],
});
```

[📖 Enable Replica Set Guide](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/)

- 📦 **Order Price Calculated via Mongoose Pre-hooks**  
  No need to calculate price manually! Final price and total cart amount are auto-calculated with Mongoose `pre` middleware.

---

## 🧱 Project Structure & Code Design

- ✅ Fully **modular** design — each feature is organized in its own folder.
- 🧪 Uses **interfaces everywhere**: in models, services, and logic — for clean and safe TypeScript code.
- 🧰 Common utilities for:
  - JWT token generation & verification
  - Bcrypt hashing and comparison
  - Redis operations  
    All of these are abstracted inside the `utils/` folder and not cluttering the main business logic.

---

## 🧾 Models & Data

- 👤 **User model**

  - Indexed on `mobile` and `email` for fast lookups 📱✉️
  - Stores hashed refresh tokens

- 🍱 **Product model with Discriminators**
  - Base `Product` schema is extended into:
    - `Food`
    - `Drink`
  - Built using **Mongoose discriminators**
  - File uploads (e.g., product images) handled using **Multer**

---

## 🌐 Environment Configuration

All required environment variables are listed in `.env.example` file.  
Ensure to rename and configure your actual `.env` file accordingly.

---

## ⚙️ Technologies Used

**Main Stack:**

- `TypeScript` 📘
- `Express.js v5` 🚂
- `MongoDB + Mongoose` 🍃
- `Redis + ioredis` 🧠
- `JWT` for authentication 🔐
- `Zod` for input validation 🛡️
- `Multer` for handling file uploads 🖼️
- `Zarinpal` for payment 💳

**Dev Tools:**

- `ts-node`, `typescript`, `@types/*` for DX
- `bcryptjs` for password hashing 🔑

```json
"dependencies": {
    "axios": "^1.9.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "ioredis": "^5.6.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.14.2",
    "multer": "^1.4.5-lts.2",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@types/axios": "^0.9.36",
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.8",
    "@types/express": "^5.0.1",
    "@types/ioredis": "^4.28.10",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.15.17",
    "bcryptjs": "^3.0.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
```

---

## 🧪 How to Run Locally

```bash
# 1️⃣ Clone the project
git clone https://github.com/your-username/foodino.git

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the project
npm run start
```

⚠️ Make sure MongoDB and Redis are both running locally.  
Also configure `.env` file correctly based on `.env.example`.

---

## 📂 Folder Structure Overview

```
project-root/
├── dist/
├── public/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── configs/
│   ├── services/
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── jwt.ts
│   │   └── redis.ts
│   ├── middlewares/
│   │   ├── authGuard.ts
│   │   └── errorHandler.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## 🛡️ Security & Best Practices

- Refresh tokens are hashed before storage 🔒
- All routes protected with fine-grained access control ✅
- Validation using Zod ensures safe and predictable inputs 🚫🐛
- Modular code keeps features isolated and easier to test & scale 📦

## 📚 API Documentation

- [All endpoints are documented with Swagger!](http://localhost:3000/apis/v1/#/)

---

## ❤️ Final Notes

This backend was designed with clean code principles, proper layering, and maintainability in mind.
Hope you enjoy using **Foodino** as much as I enjoyed building it! 😋

---

## 📞 Contact

- **Email:** mahdizareiofficial@gmail.com

## 📜 License

MIT License

[Copyright (c) 2025 Mehdi Zarei](https://github.com/Mehdi-Zarei)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
