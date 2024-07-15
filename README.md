# MERN-APP: Fullstack Mern web app

Stack: MongoDB - Express.js - React (Vite) - Node.js

Questa applicazione è un blog completo che utilizza React per il frontend e Node.js con Express per il backend.

## Struttura del progetto

```zsh
blog-app/
│
├── backend/
│   │
│   ├── config/
│   │   ├── claudinaryConfig.js
│   │   └── passportConfig.js // NEW!
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js 
│   │   ├── controlloMail.js
│   │   ├── errorHandlers.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Author.js // MODIFICATO!
│   │   └── BlogPost.js
│   │
│   ├── node_modules/
│   │
│   ├── routes/
│   │   ├── authorRoutes.js
│   │   ├── authRoutes.js // MODIFICATO!
│   │   └── blogPostRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   ├── .env // MODIFICATO!
│   ├── .gitignore
│   ├── keyGenerator.js
│   ├── MIDDLEWARES.md
│   ├── package-lock.json
│   ├── package.json
│   └── server.js // MODIFICATO!
│
└── frontend/
    ├── node_modules/
    │
    ├── public/
    │   └── vite.svg
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.css
    │   │
    │   ├── pages/
    │   │   ├── CreatePost.css
    │   │   ├── CreatePost.jsx
    │   │   ├── Home.css
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx // MODIFICATO!
    │   │   ├── PostDetail.css
    │   │   ├── PostDetail.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── services/
│   │   └── api.js
    │   │
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├──  .eslintrc.cjs
    ├──  .gitignore
    ├──  index.html
    ├──  package-lock.json
    ├──  package.json
    ├──  README.md
    └──  vite.config.js
```

## Setup/Installazione

- Clona questa repository.
- Installa le dipendenze per frontend e backend:

```bash
cd frontend && npm install
cd ../backend && npm install
```

- Configura il file .env nel backend con l'URL del tuo database MongoDB.
- Avvia il backend: cd backend && npm start
- Avvia il frontend: cd frontend && npm run dev
