// Importazione delle dipendenze necessarie
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

// Configurazione di Cloudinary con le credenziali dall'ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurazione dello storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_covers", // Specifica la cartella di destinazione su Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Limita i formati di file accettati
  },
});

// Creazione dell'uploader Multer con lo storage Cloudinary configurato
const cloudinaryUploader = multer({ storage: storage });

// Volendo, si poteva pure inserire un limite alla dimensione dei file caricabili, ad esempio:
// const cloudinaryUploader = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // Limite di 5MB
// });

// Esportazione dell'uploader per l'uso in altre parti dell'applicazione
export default cloudinaryUploader;
