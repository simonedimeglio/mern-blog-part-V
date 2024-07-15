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
