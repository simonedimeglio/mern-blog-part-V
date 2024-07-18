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
```

Nel file `server.js` aggiungiamo:

```javascript
// Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Elenco di origini consentite
    const whitelist = [
      "http://localhost:5173", // Frontend in sviluppo (assumendo che usi Vite)
      "https://tuo-dominio-frontend.vercel.app", // Frontend in produzione
    ];

    if (process.env.NODE_ENV === "development") {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Permette l'invio di credenziali (es. cookies)
};

app.use(cors(corsOptions));
```

4. Prepariamo il frontend per Vercel: in realtà per questo passaggio non ci sono grosse operazioni da fare, se non assicurarsi che nel `package.json` abbiamo effettivamente uno script di build.

5. Configurazione di Cloudinary: assicurati di avere le credenziali Cloudinary nel file `.env` del backend:

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
- Build Command: npm install
- Start Command: node server.js
- **Piano: IMPORTANTE! Seleziona il piano gratuito!**
- Nella sezione "Environment", aggiungi tutte le variabili d'ambiente necessarie.
> Assicurati di includere NODE_ENV=production.

Clicca su "Deploy Web Service" per iniziare il deploy.

### Verifichiamo il deploy 

- Una volta completato il deploy, Render ti fornirà un URL per il tuo servizio.
- Testa l'URL per assicurarti che il tuo backend sia funzionante.

### Le cose belle di Render (da sapere!)

- Il piano gratuito di Render spegne il tuo servizio dopo un periodo di inattività. Si riavvierà automaticamente quando riceve una nuova richiesta, ma potrebbe esserci un leggero ritardo nella prima risposta.

- Render supporta l'integrazione continua: ogni push al branch principale del tuo repository triggererà un nuovo deploy.