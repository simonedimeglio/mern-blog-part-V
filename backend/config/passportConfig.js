// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from 'passport-github2'; // NEW! importo strategia GitHub
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

        console.log("LOG AUTORE", author);

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

// NEW! Strategia di autenticazione di GitHub
// Configuriamo Passport per utilizzare la strategia di autenticazione GitHub
passport.use(new GitHubStrategy({
  // Usiamo le variabili d'ambiente per le credenziali OAuth di GitHub
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // URL a cui GitHub reindirizzerà dopo l'autenticazione
  callbackURL: "/api/auth/github/callback",

},
// Funzione di verifica chiamata dopo che GitHub ha autenticato l'utente
async (accessToken, refreshToken, profile, done) => {
  try {
    // Cerchiamo se esiste già un autore con questo ID GitHub nel nostro database
    let author = await Author.findOne({ githubId: profile.id });
    
    // Se l'autore non esiste, ne creiamo uno nuovo
    if (!author) {
      // Estraiamo nome e cognome dal displayName o username di GitHub
      // Se il nome è composto, consideriamo la prima parte come nome e il resto come cognome
      const [nome, ...cognomeParts] = (profile.displayName || profile.username || '').split(' ');
      const cognome = cognomeParts.join(' ');
      
      // Gestione dell'email
      let email;
      if (profile.emails && profile.emails.length > 0) {
        // Cerchiamo prima l'email primaria o verificata
        email = profile.emails.find(e => e.primary || e.verified)?.value;
        // Se non troviamo un'email primaria o verificata, prendiamo la prima disponibile
        if (!email) email = profile.emails[0].value;
      }
      
      // Se ancora non abbiamo un'email, usiamo un'email di fallback
      if (!email) {
        email = `${profile.id}@github.example.com`;
        console.warn(`Email non disponibile per l'utente GitHub ${profile.id}. Usando email di fallback.`);
      }
      
      // Creiamo un nuovo autore con i dati ottenuti da GitHub
      author = new Author({
        githubId: profile.id,
        nome: nome || 'GitHub User',  // Se non abbiamo un nome, usiamo 'GitHub User' come fallback
        cognome: cognome,
        email: email,
      });
      // Salviamo il nuovo autore nel database
      await author.save();
    }
    
    // Chiamiamo done con l'autore trovato o appena creato
    // Il primo argomento null indica che non ci sono errori
    done(null, author);
  } catch (error) {
    // Se si verifica un errore durante il processo, lo passiamo a Passport
    done(error, null);
  }
}
));

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
