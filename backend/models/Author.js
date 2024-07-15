import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String }, // NEW! tolto il required
  avatar: { type: String },
  password: { type: String }, // NEW! tolto il required
  googleId: { type: String }, // NEW! Nuovo campo per l'ID di Google
}, {
  timestamps: true,
  collection: "authors"
});

// Metodo per confrontare le password
authorSchema.methods.comparePassword = function(candidatePassword) {
  // Usa bcrypt per confrontare la password fornita con quella hashata nel database
  return bcrypt.compare(candidatePassword, this.password);
};

// NEW! Middleware per l'hashing delle password prima del salvataggio
authorSchema.pre('save', async function(next) {
  // Esegui l'hashing solo se la password è stata modificata (o è nuova)
  // Questo previene l'hashing multiplo della stessa password
  if (!this.isModified('password')) return next();

  try {
    // Genera un salt (un valore casuale per rendere l'hash più sicuro)
    const salt = await bcrypt.genSalt(10);
    // Crea l'hash della password usando il salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Passa eventuali errori al middleware successivo
  }
});

// Crea e esporta il modello 'Author' basato sullo schema definito
export default mongoose.model("Author", authorSchema);