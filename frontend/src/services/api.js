import axios from "axios"; // Importa il modulo axios per effettuare le richieste HTTP

// Definiamo l'url di base per tutte le richieste API
const API_URL = "http://localhost:5001/api";

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

// Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  }
);

// Funzione per ottenere tutti i post del blog
export const getPosts = () => api.get("/blogPosts");

// Funzione per ottenere un singolo post del blog tramite ID
export const getPost = (id) =>
  api.get(`/blogPosts/${id}`).then((response) => response.data);

// Funzione per creare un nuovo post del blog
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data", // Imposta il tipo di contenuto per la richiesta
    },
  });

// Funzione per aggiornare un post esistente tramite ID
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);

// Funzione per eliminare un post tramite ID
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Funzione per ottenere tutti i commenti di un post tramite l'ID del post
export const getComments = (postId) =>
  api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);

// Funzione per aggiungere un commento a un post
export const addComment = (postId, commentData) =>
  api
    .post(`/blogPosts/${postId}/comments`, commentData)
    .then((response) => response.data);

// Funzione per ottenere un singolo commento tramite l'ID del post e l'ID del commento
export const getComment = (postId, commentId) =>
  api
    .get(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data);

// Funzione per aggiornare un commento tramite l'ID del post e l'ID del commento
export const updateComment = (postId, commentId, commentData) =>
  api
    .put(`/blogPosts/${postId}/comments/${commentId}`, commentData)
    .then((response) => response.data);

// Funzione per eliminare un commento tramite l'ID del post e l'ID del commento
export const deleteComment = (postId, commentId) =>
  api
    .delete(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data);

// NEW! ROTTE NUOVE PER AUTENTICAZIONE

// NEW! Funzione per registrare un nuovo utente
export const registerUser = (userData) => api.post("/authors", userData);

// NEW: Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// NEW: Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get('/auth/me'); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error('Errore nel recupero dei dati utente:', error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Esporta l'istanza di axios configurata per essere utilizzata altrove nel progetto
export default api;