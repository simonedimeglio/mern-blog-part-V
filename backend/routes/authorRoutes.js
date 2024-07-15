import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary (CON CLOUDINARY)

const router = express.Router();

// GET /authors: ritorna la lista degli autori
router.get("/", async (req, res) => {
  try {
    // Recupera tutti gli autori dal database
    const authors = await Author.find();
    // Invia la lista degli autori come risposta JSON
    res.json(authors);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/123: ritorna il singolo autore
router.get("/:id", async (req, res) => {
  try {
    // Cerca un autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      // Se l'autore non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Autore non trovato" });
    }
    // Invia l'autore trovato come risposta JSON
    res.json(author);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// NEW! POST /authors: crea un nuovo autore
router.post("/", async (req, res) => {
  try {
    // Crea una nuova istanza di Author con i dati dalla richiesta
    const author = new Author(req.body);

    // La password verrà automaticamente hashata grazie al middleware pre-save
    // che abbiamo aggiunto nello schema Author

    // Salva il nuovo autore nel database
    const newAuthor = await author.save();

    // Rimuovi la password dalla risposta per sicurezza
    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;

    // Invia il nuovo autore creato come risposta JSON con status 201 (Created)
    res.status(201).json(authorResponse);
  } catch (err) {
    // In caso di errore (es. validazione fallita), invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

// PUT /authors/123: modifica l'autore con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna l'autore nel database
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAuthor) {
      // Se l'autore non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Autore non trovato" });
    }
    // Invia l'autore aggiornato come risposta JSON
    res.json(updatedAuthor);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

// DELETE /authors/123: cancella l'autore con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    // Trova e elimina l'autore dal database
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      // Se l'autore non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Autore non trovato" });
    }
    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: "Autore eliminato" });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    // Cerca l'autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      // Se l'autore non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Autore non trovato" });
    }
    // Cerca tutti i blog post dell'autore usando la sua email
    const blogPosts = await BlogPost.find({ author: author.email });
    // Invia la lista dei blog post come risposta JSON
    res.json(blogPosts);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    // Cerca l'autore nel database, se non esiste rispondo con una 404
    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }

    // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
    author.avatar = req.file.path;

    // Salva le modifiche nel db
    await author.save();

    // Invia la risposta con l'autore aggiornato
    res.json(author);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'avatar:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

export default router;
