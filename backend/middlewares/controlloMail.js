const controlloMail = (req, res, next) => {
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
