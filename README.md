# Imagify - AI Image Generator

<img width="844" height="549" alt="imagifyPoster" src="https://github.com/user-attachments/assets/fa2f61ef-4be7-480c-9a82-5f5f85ee9fd1" />


## Overview


Imagify is a full-stack web application that allows users to generate images from text prompts using AI, manage their credits, and purchase more credits via Razorpay integration.

---

## Features

- **User Authentication:** Register, login, and secure session management with JWT.
- **Text-to-Image Generation:** Generate images using AI (ClipDrop API) from text prompts.
- **Credit System:** Each image generation deducts credits; users can buy more credits.
- **Payment Integration:** Buy credits securely using Razorpay.
- **Responsive UI:** Built with React and Tailwind CSS for a modern, responsive experience.
- **Persistent State:** User session and credits persist across page reloads.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios, Framer Motion, React Toastify
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Razorpay, ClipDrop API
- **Other:** Vite (React), dotenv, FormData

---

## Folder Structure

```
imagify/
├── client/           # React frontend
│   ├── src/
│   ├── public/
│   ├── .env
│   └── ...
├── server/           # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env
│   └── ...
├── README.md         # Project documentation
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd imagify
```

### 2. Backend Setup

```bash
cd server
npm install
# Configure .env with your MongoDB, JWT, Razorpay, and ClipDrop API keys
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install
# Configure .env with your backend URL and Razorpay key
npm run dev
```

---

## Environment Variables

### Backend (`server/.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIPDROP_API=your_clipdrop_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR
```

### Frontend (`client/.env`)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## Usage

- Register or login to your account.
- Generate images by entering a text prompt.
- Each generation deducts credits; buy more credits as needed.
- Download generated images or generate new ones.

---

## Notes

- Ensure both backend and frontend `.env` files are correctly set up.
- Restart the backend after any `.env` change.
- For production, use secure secrets and production-ready API keys.

---

## License

MIT



echo "# Imagify-AI" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/swayam-developer/Imagify-AI.git
git push -u origin main

