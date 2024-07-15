# MIDDLEWARES

**Cosa sono i middlwares?**

I middlewares ci permettono di rendere "modulare" la logica della nostra applicazione, separando compiti come l'autenticazione, la gestione degli errori, il parsing del body della richiesta, ecc. in funzioni riutilizzabili.

**Quindi, tecnicamente:**

I middlewares sono funzioni che hanno accesso all'**oggetto richiesta (req)**, all'**oggetto risposta (res)**, e alla **funzione next()**.

**Caratteristiche del middleware:**

- Può eseguire qualsiasi codice.
- Può modificare gli oggetti richiesta e risposta.
- Può terminare il ciclo richiesta-risposta.
- Può chiamare il prossimo middleware nella "catena".

*Esempio:*

```javascript
app.use(function(req, res, next) {
  console.log('RICHIESTA RICEVUTA');
  next();
});
```

*Questo è un middleware che "osserva" ogni richiesta e la registra, poi passa il controllo al prossimo middleware o alla route handler con next().*

Se un middleware non termina il ciclo richiesta-risposta, deve chiamare next() per passare il controllo al prossimo middleware, altrimenti la richiesta rimarrà in sospeso.

## Esempio 1 - Middleware per il controllo della mail

Creiamo un middlware semplice che controlla se l'utente ha una specifica email. Questo tipo di middleware potrebbe essere utile per implementare un controllo di base prima di permettere l'accesso a certe route.

1. **Creiamo una cartella "middlewares" che conterrà i nostri middleware. All'interno creiamo un file "controlloMail.js":**

```javascript
const controlloMail = (req, res, next) => {
  // Per didattica: decidiamo una mail che simuli un utente autorizzato ad accedere
  const emailAutorizzata = "autorizzato@mail.it";

  // Ipotizziamo che l'email dell'utente sia passata nell'header della richiesta
  const mailUtente = req.headers["user-email"];

  if (mailUtente === emailAutorizzata) {
    // Se l'email corrisponde, passiamo al prossimo middleware o alla route handler
    next();
  } else {
    // Se l'email non corrisponde, inviamo un errore
    res
      .status(403)
      .json({ message: "ACCESSO NEGATO: Utente non autorizzato." });
  }
};

export default controlloMail;
```
2. **Utilizziamo il middlware nelle nostre route**

```javascript
import express from "express";
import BlogPost from "../models/BlogPost.js";
import controlloMail from "../middlewares/controlloMail.js";

const router = express.Router();

// Applichiamo il middleware a tutte le route dei blog post
router.use(controlloMail);

// Oppure, per applicarlo solo a specifiche route
// router.get("/", controlloMail, async (req, res) => { ... });

// Le route esistenti rimangono INVARIATE!

// ... altre route

export default router;
```

**Quindi, in React, per fare una GET dopo aver applicato un middleware come questo, sarà necessario passare "user-email" come headers:**

```javascript
// USANDO FETCH
const fetchBlogPosts = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/blogPosts', {
      method: 'GET',
      headers: {
        'user-email': 'autorizzato@mail.it',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('ERRORE');
    }

    const data = await response.json();
    console.log(data);
    // Qui puoi gestire i dati, ad esempio aggiornando lo stato del componente
  } catch (error) {
    console.error('ERRORE:', error);
  }
};
```

Oppure, usando Axios come segue:

```javascript
// USANDO AXIOS
import axios from 'axios';

const fetchBlogPosts = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/blogPosts', {
      headers: {
        'user-email': 'autorizzato@mail.it'
      }
    });

    console.log(response.data);
    // Qui puoi gestire i dati, ad esempio aggiornando lo stato del componente
  } catch (error) {
    console.error('ERRORE:', error);
  }
};
```

## Middleware di gestione degli errori

Certamente! I middleware di gestione degli errori sono una parte cruciale di un'applicazione Express robusta.

La presenza del parametro **err** distingue questo tipo di middleware dagli altri.

*Struttura di un middleware di gestione degli errori:*

```javascript
(err, req, res, next) => {
  // Qua inserisci la logica di gestione dell'errore
}
```

**Posizionamento**: Questi middleware vengono definiti **DOPO** tutte le altre rotte e middleware, tipicamente alla fine del file `server.js`.

1. **Creo un file "errorHandlers.js" nella cartella "middlewares"**:

```javascript
// 400 - BAD REQUEST - Gestisce errori di richieste mal formate o dati non validi
export const badRequestHandler = (err, req, res, next) => {
  // Verifica se l'errore ha status 400 o se è un errore di validazione
  if (err.status === 400 || err.name === "ValidationError") {
    // Invia una risposta JSON con status 400
    res.status(400).json({
      error: "RICHIESTA NON VALIDA",
      message: err.message, // Utilizza il messaggio di errore originale
    });
  } else {
    // Se non è un errore 400, passa al prossimo middleware di gestione errori
    next(err);
  }
};

// 401 - UNAUTHORIZED - Gestisce errori di autenticazione
export const unauthorizedHandler = (err, req, res, next) => {
  // Verifica se l'errore ha status 401
  if (err.status === 401) {
    // Invia una risposta JSON con status 401
    res.status(401).json({
      error: "ERRORE DI AUTENTICAZIONE",
      message: "Richiesta nuova autenticazione",
    });
  } else {
    // Se non è un errore 401, passa al prossimo middleware di gestione errori
    next(err);
  }
};

// 404 - NOT FOUND - Richieste a risorse non esistenti
export const notFoundHandler = (req, res, next) => {
  // Questo middleware non ha un controllo dell'errore perché gestisce tutte le richieste
  // che arrivano a questo punto senza essere state gestite da altre rotte
  res.status(404).json({
    error: "RISORSA NON TROVATA",
    message: "La risorsa richiesta non è stata trovata",
  });
};

// 500 - INTERNAL SERVER ERROR - Gestisce tutti gli altri errori non specificati
export const genericErrorHandler = (err, req, res, next) => {
  // Logga lo stack trace dell'errore per debug
  console.error(err.stack);

  // Invia una risposta generica per tutti gli altri tipi di errori
  res.status(500).json({
    error: "Internal Server Error",
    message: "Errore generico",
  });
  // Nota: non c'è chiamata a next() perché questo è l'ultimo handler
};


// NB: lo Stack Trace è una rappresentazione della sequenza di chiamate a funzione
// che hanno portato al punto in cui si è verificato un errore.
//
// Contiene i nomi delle funzioni chiamate, i numeri di riga e i nomi dei file in cui si trovano queste funzioni
//
// Si usa per debug
//
// ESEMPIO:

// Error: Qualcosa è andato storto
//    at processPayment (/app/services/payment.js:42:15)
//    at handleCheckout (/app/routes/checkout.js:23:10)
//    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
//    ...
```

2. **Utilizzo i middleware nel server (server.js)**

```javascript
// Gli altri import rimangono invariati
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler
} from './middlewares/errorHandlers.js';

// Il resto del codice rimane invariato

// Applicazione dei middleware di gestione errori
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// app.listen(PORT, () => { ...
```
