// Importa il modulo multer per la gestione dell'upload dei file
import multer from "multer";
// Importa il modulo path per la manipolazione dei percorsi dei file
import path from "path";

// Configura lo storage per multer
const storage = multer.diskStorage({
  // Specifica la cartella di destinazione per i file caricati
  destination: (req, file, cb) => {
    cb(null, "uploads/");
    // cb -> callback
    // null -> primo argomento, indica che non c'è stato aclun errore
    // "uploads/" -> cartella di destinazione dei file
  },
  // Definisce il nome del file una volta caricato
  filename: (req, file, cb) => {
    // Crea un suffisso unico basato sulla data e un numero casuale
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Combina il nome del campo, il suffisso unico e l'estensione originale del file
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crea un'istanza di multer con la configurazione dello storage
const upload = multer({ storage: storage });

// Esporta il middleware di upload per l'uso in altre parti dell'applicazione
export default upload;
