# MERN-APP: Backend

## RECAP - Struttura del progetto

```zsh
blog-app/
│
├── backend/
│   │
│   ├── config/
│   │   └── claudinaryConfig.js
│   │
│   ├── middlewares/
│   │   ├── controlloMail.js
│   │   ├── errorHandlers.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Author.js
│   │   └── BlogPost.js
│   │
│   ├── node_modules/
│   │
│   ├── routes/
│   │   ├── authorRoutes.js
│   │   └── blogPostRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── MIDDLEWARES.md
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
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
    │   │   ├── PostDetail.css
    │   │   └── PostDetail.jsx
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

## Backend

1. **Server (server.js)**

Configura l'applicazione Express.
Definisce le connessioni al database MongoDB.
Imposta le route per autori e post del blog.

2. **Modelli (Author.js, BlogPost.js)**

Definiscono la struttura dei dati per autori e post del blog.
Utilizzano Mongoose per l'interfaccia con MongoDB.

3. **Route (authorRoutes.js, blogPostRoutes.js)**

Definiscono gli endpoint API per le operazioni CRUD su autori e post.
