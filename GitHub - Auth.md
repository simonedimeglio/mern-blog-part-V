# Autenticazione con GitHub

Prima di tutto, dovrai creare una nuova OAuth App su GitHub:

1. Vai su GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
2. Compila i campi richiesti, in particolare il "Authorization callback URL" che sarà simile a quello di Google (_es. http://localhost:5001/api/auth/github/callback_)

## Installazione delle dipendenze

Nel tuo progetto backend, installa il pacchetto passport per GitHub:

```bash
npm install passport-github2
```

## Aggiorniamo il file `.env`

```env
GITHUB_CLIENT_ID = ******
GITHUB_CLIENT_SECRET = ******
```

## Modifica del `passportConfig.js`

```javascript
import { Strategy as GitHubStrategy } from "passport-github2";
// Configurazione Google Strategy (rimane la stessa)

// NEW! Strategia di autenticazione di GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ githubId: profile.id });

        if (!author) {
          const [nome, ...cognomeParts] = (
            profile.displayName ||
            profile.username ||
            ""
          ).split(" ");
          const cognome = cognomeParts.join(" ");

          // Gestione dell'email
          let email;
          if (profile.emails && profile.emails.length > 0) {
            // Cerchiamo prima l'email primaria o verificata
            email = profile.emails.find((e) => e.primary || e.verified)?.value;
            // Se non troviamo un'email primaria o verificata, prendiamo la prima disponibile
            if (!email) email = profile.emails[0].value;
          }

          // Se ancora non abbiamo un'email, usiamo un fallback
          if (!email) {
            email = `${profile.id}@github.example.com`;
            console.warn(
              `Email non disponibile per l'utente GitHub ${profile.id}. Usando email di fallback.`
            );
          }

          author = new Author({
            githubId: profile.id,
            nome: nome || "GitHub User",
            cognome: cognome,
            email: email,
          });
          await author.save();
        }

        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serializzazione e deserializzazione rimangono le stesse
```

## Aggiornamento del modello `Author.js`

```javascript
  cognome: { type: String}, // NEW! tolto required
  email: { type: String, unique: true }, // NEW! tolto required
  githubId: { type: String }, // NEW! Nuovo campo per l'ID di GitHub
```

## Aggiornamento delle rotte per l'autenticazione in `authRoutes.js`

```javascript
// [...rotte di Google]

// Nuove rotte GitHub
// NEW! Nuove rotte GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  handleAuthCallback
);

// Funzione helper per gestire il callback di autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`http://localhost:5173/login?token=${token}`);
  } catch (error) {
    console.error("Errore nella generazione del token:", error);
    res.redirect("/login?error=auth_failed");
  }
}
```

## Aggiornamento del frontend con pulsante per login di GitHub

```javascript
// NEW! Funzione per gestire il login con GitHub
const handleGitHubLogin = () => {
  window.location.href = "http://localhost:5001/api/auth/github";
};

// [...resto del codice]
<button onClick={handleGitHubLogin}>Accedi con GitHub</button>;
```
