# Rendere la nostra app `production-ready` con deploy

Ti guiderò attraverso il processo di rendere la tua app production-ready e di effettuare il deploy su **Render** (_per il backend_) e **Vercel** (_per il frontend_), utilizzando **Cloudinary** come CDN.

Seguiremo un approccio passo-passo, spiegando ogni dettaglio.

## Preparazione del progetto

1. Assicurati che il tuo progetto sia organizzato con due cartelle principali: `backend` e `frontend`.

> `backend`contiene il codice del server (_Express.js_) e `frontend` contiene il codice del client (_React_)

2. Assicurati della presenza del file `.env` sia nel backend, che nel frontend.

3. Configuriamo `CORS` nel backend:

Nel file `.env` del backend aggiungiamo:

```env
NODE_ENV = development
FRONTEND_URL = lo aggiungiamo dopo il deploy su vercel
```

Nel file `authRoutes.js` dobbiamo fare qualche modifica: 

```javascript
// Definisci l'URL del frontend usando una variabile d'ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ... altre rotte esistenti ...

// Rotta di callback per l'autenticazione Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);

// Rotta di callback per l'autenticazione GitHub
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
  handleAuthCallback
);

// Funzione helper per gestire il callback di autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    // Usa FRONTEND_URL per il reindirizzamento
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
}
```


Nel file `server.js` aggiungiamo:

```javascript
// NEW! Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://mern-blog-part-v.vercel.app/', // Frontend in produzione (prendere da vercel!)
      'https://mern-blog-ctt3.onrender.com' // URL del backend (prendere da render!)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};

app.use(cors(corsOptions));
```

4. Configurazione di Cloudinary: assicurati di avere le credenziali Cloudinary nel file `.env` del backend:

```env
CLOUDINARY_CLOUD_NAME = **********
CLOUDINARY_API_KEY = **********
CLOUDINARY_API_SECRET = **********
```
## Deploy del backend su Render

Prima di iniziare il deploy su Render, assicurati che la tua repo sia aggiornata.

### Creazione di un account Render:

Vai su https://render.com/ e crea un account gratuito.

### Creazione di un nuovo Web Service:

1. Dalla dashboard di Render, clicca su "New +" e seleziona "Web Service".
2. Connetti il tuo repository GitHub (se non l'hai già fatto).
3. Seleziona il repository del tuo backend.

### Configuriamo il Web Service

- Name: Scegli un nome per il tuo servizio.
- Language: Seleziona "Node".
- Branch: main
- Region: Frankfurt (EU Central)
- Root Directory: non inserire niente
- Build Command: cd backend && npm install
- Start Command: cd backend && node server.js
- **Piano: IMPORTANTE! Seleziona il piano gratuito!**
- Nella sezione "Environment", aggiungi tutte le variabili d'ambiente necessarie.

> Assicurati di includere NODE_ENV = production.

Clicca su "Deploy Web Service" per iniziare il deploy.

### Verifichiamo il deploy 

- Una volta completato il deploy, Render ti fornirà un URL per il tuo servizio.
- Testa l'URL per assicurarti che il tuo backend sia funzionante.

### Le cose belle di Render (da sapere!)

- Il piano gratuito di Render spegne il tuo servizio dopo un periodo di inattività. Si riavvierà automaticamente quando riceve una nuova richiesta, ma potrebbe esserci un leggero ritardo nella prima risposta.

- Render supporta l'integrazione continua: ogni push al branch principale del tuo repository triggererà un nuovo deploy.

## Deploy del frontend su Vercel 

Prima dobbiamo preparare il frontend per Vercel

### Settiamo le variabili d'ambiente del frontend in `.env`

```env
VITE_API_URL = https://tua-app.onrender.com
CI = false
```

### Aggiornamento dei file che usavano `localhost`

Dobbiamo aggiornare tutti i riferimenti a localhost nel frontend per utilizzare l'URL del backend deployato. 

- Aggiorniamo il file `api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
```
- Aggiorniamo il file `Login.jsx`

```jsx
// Importa l'URL dell'API dalla variabile d'ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Login() {
  // ... altri stati e logica del componente

  // Funzione aggiornata per gestire il login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // Funzione aggiornata per gestire il login con GitHub
  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };
```


### Deploy

- Project Name: nome del progetto, a piacere tuo. 
- Framework Preset: lascia come lo trovi 
- Root Directory: fai `edit` e metti `frontend`
- Environment Variables: metti quelle del file `.env` del frontend

Lancia la build et voilà!

### Aggiorniamo il file `.env` del backend oltre alla lista degli env su render

```env
FRONTEND_URL = https://mern-blog-part-v.vercel.app/
NODE_ENV = production
```

> Attendete il nuovo deploy ogni volta che aggiornate un env su render