# Week 4 - W4D1 | Lezione Serale (Lunedì 15 Luglio 2024)

## BACKEND ->

### Aggiungiamo OAuth al progetto

Per prima cosa, dobbiamo aggiungere OAuth al nostro progetto.

OAuth è un protocollo di autenticazione che permette agli utenti di accedere alla nostra applicazione utilizzando i loro account di altri servizi (come Google, in questo caso).

Prima di tutto, installiamo i pacchetti necessari:

```
npm install passport passport-google-oauth20 express-session
```

Link alla docs:

- Passport: https://www.passportjs.org/
- Passport Google OAuth: https://www.npmjs.com/package/passport-google-oauth20

**Cos’è Passport.js?**

`Passport.js` è una libreria che facilita l’autenticazione degli utenti nelle applicazioni Node.js. Ti permette di aggiungere il login tramite username e password, social network (come Facebook, Google, Twitter), e molti altri servizi, senza dover scrivere tutto il codice da zero.

**Come funziona?**

	1.	*Strategie*: `Passport.js` usa un sistema di “strategie”. Ogni strategia è come un modulo separato che gestisce un particolare metodo di autenticazione (ad esempio, login con username e password, login con Google, ecc.).
	2.	*Middleware*: `Passport.js` si integra con `Express` come middleware. Questo significa che si inserisce nel flusso delle richieste del server per gestire l’autenticazione.
	3.	*Serializzazione*: Dopo che un utente è autenticato, `Passport.js` lo “serializza” in una sessione. Questo permette al server di ricordare l’utente tra diverse richieste.

### Integriamo il file `.env`

Link per generare chiavi Google: https://console.cloud.google.com/

```env
SESSION_SECRET = codice_generato_da_keyGenerator
GOOGLE_CLIENT_ID= tuo_client_id
GOOGLE_CLIENT_SECRET= tuo_client_secret
```

Il `SESSION_SECRET` è utilizzato da express-session per cifrare i cookie di sessione. Lasciamo quindi al `JWT_SECRET` il compito di firmare e verificare i JSON Web Tokens e basta.

Nella console, ricorda di inserire URI di reindirzzamento autorizzati.

- Vai alla Google Cloud Console.
- Seleziona il tuo progetto.
- Vai a "API e servizi" > "Credenziali".
- Trova l'ID client OAuth 2.0 che stai usando e cliccaci sopra.
- Nella sezione "URI di reindirizzamento autorizzati", aggiungi o modifica l'URL per corrispondere esattamente al tuo URL di callback.

L'URL completo dovrebbe essere qualcosa del tipo:

```
http://localhost:5001/api/auth/google/callback
```

### Aggiorniamo il modello Author

Dobbiamo aggiornare il modello Author per includere l'ID di Google. Modifica il file `Author.js`:

```javascript
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dataDiNascita: { type: String }, // NEW! tolto required, deve essere opzionale
    avatar: { type: String },
    password: { type: String }, // NEW! tolto required, deve essere opzionale
    googleId: { type: String }, // NEW! Nuovo campo per l'ID di Google
  },
  {
    timestamps: true,
    collection: "authors",
  }
);

// Il resto del codice rimane invariato...

export default mongoose.model("Author", authorSchema);
```

> Abbiamo aggiunto il campo googleId allo schema e reso dataDiNascita e password opzionali, perché gli utenti che si registrano con Google potrebbero non fornire queste informazioni!

### Configuriamo Passport

Crea un nuovo file chiamato `passportConfig.js` nella cartella `config` del backend:

```javascript
// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

// Configuriamo la strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      // Usiamo le variabili d'ambiente per le credenziali OAuth
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL a cui Google reindizzerà dopo l'autenticazione
      callbackURL: "/api/auth/google/callback",
    },
    // Questa funzione viene chiamata quando l'autenticazione Google ha successo
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se esiste già un autore con questo ID Google
        let author = await Author.findOne({ googleId: profile.id });

        // Se l'autore non esiste, ne creiamo uno nuovo
        if (!author) {
          author = new Author({
            googleId: profile.id, // ID univoco fornito da Google
            nome: profile.name.givenName, // Nome dell'utente
            cognome: profile.name.familyName, // Cognome dell'utente
            email: profile.emails[0].value, // Email principale dell'utente
            // Nota: la data di nascita non è fornita da Google, quindi la impostiamo a null
            dataDiNascita: null,
          });
          // Salviamo il nuovo autore nel database
          await author.save();
        }

        // Passiamo l'autore al middleware di Passport
        // Il primo argomento null indica che non ci sono errori
        done(null, author);
      } catch (error) {
        // Se si verifica un errore, lo passiamo a Passport
        done(error, null);
      }
    }
  )
);

// Serializzazione dell'utente per la sessione
// Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
passport.serializeUser((user, done) => {
  // Memorizziamo solo l'ID dell'utente nella sessione
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
// Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
passport.deserializeUser(async (id, done) => {
  try {
    // Cerchiamo l'utente nel database usando l'ID
    const user = await Author.findById(id);
    // Passiamo l'utente completo al middleware di Passport
    done(null, user);
  } catch (error) {
    // Se si verifica un errore durante la ricerca, lo passiamo a Passport
    done(error, null);
  }
});

// Esportiamo la configurazione di Passport
export default passport;
```

Questo file configura Passport per utilizzare la strategia di autenticazione di Google. Spieghiamo i punti principali:

- Usiamo `GoogleStrategy` per gestire l'autenticazione con Google.
- Nella callback della strategia, cerchiamo l'autore nel nostro database usando l'ID di Google.
- Se l'autore non esiste, ne creiamo uno nuovo con le informazioni fornite da Google.
- Le funzioni `serializeUser` e `deserializeUser` sono usate da `Passport` per gestire le sessioni degli utenti.

### Usiamo la Passport Strategy per connettere Google al backend

Modifichiamo il file `server.js` per includere Passport e la sessione:

```javascript
// [resto degli import]
import session from "express-session";
import passport from "./config/passportConfig.js";

// [resto del codice]
app.use(cors());
app.use(express.json());

// NEW! Configurazione della sessione
app.use(
  session({
    // Il 'secret' è usato per firmare il cookie di sessione
    // È importante che sia una stringa lunga, unica e segreta
    secret: process.env.SESSION_SECRET,

    // 'resave: false' dice al gestore delle sessioni di non
    // salvare la sessione se non è stata modificata
    resave: false,

    // 'saveUninitialized: false' dice al gestore delle sessioni di non
    // creare una sessione finché non memorizziamo qualcosa
    // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
    saveUninitialized: false,
  })
);

// NEW! Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// [resto del codice]
```

In questo caso, le principali modifiche che abbiamo fatto sono:

- Importazione di session e passport.
- Configurazione della sessione con express-session.
- Inizializzazione di Passport.

### Abilitiamo il login con Google nella nostra app, aggiungendo tutti gli endpoint che servono al caso

Modifichiamo il file `authRoutes.js` per includere le rotte per l'autenticazione Google:

```javascript
// [resto degli import]
import passport from "../config/passportConfig.js"; // NEW! Importiamo passport

// [rotte già esistenti]

// Rotta per iniziare il processo di autenticazione Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Questo endpoint inizia il flusso di autenticazione OAuth con Google
// 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
// scope: specifica le informazioni richiediamo a Google (profilo e email)

// Rotta di callback per l'autenticazione Google
router.get(
  "/google/callback",
  // Passport tenta di autenticare l'utente con le credenziali Google
  passport.authenticate("google", { failureRedirect: "/login" }),
  // Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login

  async (req, res) => {
    try {
      // A questo punto, l'utente è autenticato con successo
      // req.user contiene i dati dell'utente forniti da Passport

      // Genera un JWT (JSON Web Token) per l'utente autenticato
      // Usiamo l'ID dell'utente dal database come payload del token
      const token = await generateJWT({ id: req.user._id });

      // Reindirizza l'utente al frontend, passando il token come parametro URL
      // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (error) {
      // Se c'è un errore nella generazione del token, lo logghiamo
      console.error("Errore nella generazione del token:", error);
      // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
      res.redirect("/login?error=auth_failed");
    }
  }
);

export default router;
```

Queste nuove rotte gestiranno:

- L'inizio dell'autenticazione Google (`/google`).
- La callback dopo l'autenticazione Google (`/google/callback`).

## FRONTEND ->

### Aggiornamento della login

Modifichiamo il file `Login.jsx` per includere il pulsante di login con Google:

```jsx
// [altri import]
import { useState, useEffect } from "react"; // useEffect per gestire side effects come il controllo del token
import { useNavigate, useLocation } from "react-router-dom"; // Per la navigazione e l'accesso ai parametri dell'URL

// ... [resto del codice] ...

// Inizializziamo gli hooks di react-router-dom
const navigate = useNavigate(); // Per navigare programmaticamente
const location = useLocation(); // Per accedere ai parametri dell'URL corrente

useEffect(() => {
  // Questo effect viene eseguito dopo il rendering del componente
  // e ogni volta che location o navigate cambiano

  // Estraiamo i parametri dall'URL
  const params = new URLSearchParams(location.search);
  // Cerchiamo un parametro 'token' nell'URL
  const token = params.get("token");

  if (token) {
    // Se troviamo un token, lo salviamo nel localStorage
    localStorage.setItem("token", token);
    // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
    window.dispatchEvent(new Event("storage"));
    // Navighiamo alla home page
    navigate("/");
  }
}, [location, navigate]); // Questo effect dipende da location e navigate

// ... [resto del codice] ...

// Funzione per gestire il login con Google
const handleGoogleLogin = () => {
  // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Google
  window.location.href = "http://localhost:5001/api/auth/google";
};

return (
  // ... [resto del codice] ...
  <button onClick={handleGoogleLogin}>Accedi con Google</button>
);
```

Le principali modifiche che abbiamo fatto in questo componente sono:

- Aggiunta di un effetto per gestire il token ricevuto dopo l'autenticazione Google.
- Aggiunta di un pulsante per il login con Google.
- Implementazione della funzione handleGoogleLogin per reindirizzare l'utente all'endpoint di autenticazione Google.

> Abbiamo completato tutti i passaggi per implementare l'autenticazione OAuth con Google nel nostro progetto di blog MERN. Abbiamo aggiunto OAuth al backend, configurato Passport per l'autenticazione Google, aggiornato il modello Author, integrato JWT e aggiunto un pulsante per il login con Google nel frontend.
