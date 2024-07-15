# MERN-APP: Frontend

## Recap - Struttura del progetto

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

## Componenti Frontend

1. **Navbar (Navbar.jsx)**

Fornisce la navigazione tra le pagine principali dell'applicazione.
Link per Home e Creazione Post.

2. **Home Page (Home.jsx)**

Visualizza una griglia di tutti i post del blog.
Ogni post è rappresentato da una card cliccabile con immagine, titolo e autore.
Utilizza getPosts da api.js per recuperare i dati.

3. **Pagina di Dettaglio Post (PostDetail.jsx)**

Mostra i dettagli completi di un singolo post.
Include titolo, immagine di copertina, contenuto, categoria, autore e tempo di lettura.
Utilizza getPost da api.js per recuperare i dati del post specifico.

4. **Pagina di Creazione Post (CreatePost.jsx)**

Form per la creazione di un nuovo post.
Include campi per titolo, categoria, contenuto, URL immagine di copertina, tempo di lettura e autore.
Utilizza createPost da api.js per inviare i dati al backend.

5. **Servizio API (api.js)**

Centralizza tutte le chiamate API.
Definisce l'URL base dell'API.
Fornisce funzioni per operazioni CRUD: getPosts, getPost, createPost, ecc.
