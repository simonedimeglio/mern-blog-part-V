// Definizione dell'URL base per tutte le richieste API
const API_URL = "http://localhost:5001/api";

// Funzione di utilità per effettuare richieste con il token di autenticazione
const fetchWithAuth = (url, options = {}) => {
  // Recupera il token dal localStorage
  const token = localStorage.getItem("token");
  // Prepara gli headers di default, includendo il Content-Type
  const headers = {
    // Spread degli headers esistenti
    ...options.headers,
    // Aggiunge il Content-Type predefinito
    'Content-Type': 'application/json',
  };
  
  // Se esiste un token, lo aggiunge agli headers
  if (token) {
    // Aggiunge l'header di autorizzazione con il token
    headers['Authorization'] = `Bearer ${token}`;
    // Log del token per debugging
    console.log("Token inviato:", token);
  }

  // Effettua la richiesta fetch con gli headers e le opzioni fornite
  return fetch(`${API_URL}${url}`, {
    // Spread delle opzioni esistenti
    ...options,
    // Aggiunge gli headers preparati
    headers,
  }).then(response => {
    // Verifica se la risposta è ok (status 200-299)
    if (!response.ok) {
      // Lancia un errore se la risposta non è ok
      throw new Error('Errore nella richiesta');
    }
    // Converte la risposta in JSON
    return response.json();
  });
};

// Funzione per ottenere tutti i post del blog
export const getPosts = () => fetchWithAuth('/blogPosts');

// Funzione per ottenere un singolo post del blog tramite ID
export const getPost = (id) => fetchWithAuth(`/blogPosts/${id}`);

// Funzione per creare un nuovo post del blog
export const createPost = (postData) => {
  // Crea un oggetto FormData per inviare dati multipart
  const formData = new FormData();
  // Itera su tutte le proprietà di postData
  for (const key in postData) {
    // Aggiunge ogni coppia chiave-valore a formData
    formData.append(key, postData[key]);
  }
  
  // Effettua una richiesta POST con FormData
  return fetch(`${API_URL}/blogPosts`, {
    // Imposta il metodo della richiesta a POST
    method: 'POST',
    // Imposta il corpo della richiesta a formData
    body: formData,
    // Imposta gli headers, incluso il token di autorizzazione
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
  }).then(response => {
    // Verifica se la risposta è ok
    if (!response.ok) {
      // Lancia un errore se la creazione del post fallisce
      throw new Error('Errore nella creazione del post');
    }
    // Converte la risposta in JSON
    return response.json();
  });
};

// Funzione per aggiornare un post esistente tramite ID
export const updatePost = (id, postData) => 
  // Usa fetchWithAuth per effettuare una richiesta PUT
  fetchWithAuth(`/blogPosts/${id}`, {
    // Imposta il metodo della richiesta a PUT
    method: 'PUT',
    // Converte postData in JSON e lo imposta come corpo della richiesta
    body: JSON.stringify(postData),
  });

// Funzione per eliminare un post tramite ID
export const deletePost = (id) => 
  // Usa fetchWithAuth per effettuare una richiesta DELETE
  fetchWithAuth(`/blogPosts/${id}`, { method: 'DELETE' });

// Funzione per ottenere tutti i commenti di un post tramite l'ID del post
export const getComments = (postId) => 
  // Usa fetchWithAuth per ottenere i commenti
  fetchWithAuth(`/blogPosts/${postId}/comments`);

// Funzione per aggiungere un commento a un post
export const addComment = (postId, commentData) => 
  // Usa fetchWithAuth per effettuare una richiesta POST
  fetchWithAuth(`/blogPosts/${postId}/comments`, {
    // Imposta il metodo della richiesta a POST
    method: 'POST',
    // Converte commentData in JSON e lo imposta come corpo della richiesta
    body: JSON.stringify(commentData),
  });

// Funzione per ottenere un singolo commento tramite l'ID del post e l'ID del commento
export const getComment = (postId, commentId) => 
  // Usa fetchWithAuth per ottenere un commento specifico
  fetchWithAuth(`/blogPosts/${postId}/comments/${commentId}`);

// Funzione per aggiornare un commento tramite l'ID del post e l'ID del commento
export const updateComment = (postId, commentId, commentData) => 
  // Usa fetchWithAuth per effettuare una richiesta PUT
  fetchWithAuth(`/blogPosts/${postId}/comments/${commentId}`, {
    // Imposta il metodo della richiesta a PUT
    method: 'PUT',
    // Converte commentData in JSON e lo imposta come corpo della richiesta
    body: JSON.stringify(commentData),
  });

// Funzione per eliminare un commento tramite l'ID del post e l'ID del commento
export const deleteComment = (postId, commentId) => 
  // Usa fetchWithAuth per effettuare una richiesta DELETE
  fetchWithAuth(`/blogPosts/${postId}/comments/${commentId}`, { method: 'DELETE' });

// Funzione per registrare un nuovo utente
export const registerUser = (userData) => 
  // Usa fetchWithAuth per effettuare una richiesta POST
  fetchWithAuth('/authors', {
    // Imposta il metodo della richiesta a POST
    method: 'POST',
    // Converte userData in JSON e lo imposta come corpo della richiesta
    body: JSON.stringify(userData),
  });

// Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    // Effettua una richiesta POST per il login
    const response = await fetch(`${API_URL}/auth/login`, {
      // Imposta il metodo della richiesta a POST
      method: 'POST',
      // Imposta gli headers della richiesta
      headers: {
        'Content-Type': 'application/json',
      },
      // Converte le credenziali in JSON e le imposta come corpo della richiesta
      body: JSON.stringify(credentials),
    });
    
    // Verifica se la risposta è ok
    if (!response.ok) {
      // Lancia un errore se il login fallisce
      throw new Error('Errore nel login');
    }
    
    // Converte la risposta in JSON
    const data = await response.json();
    // Log della risposta per debugging
    console.log("Risposta API login:", data);
    // Restituisce i dati della risposta
    return data;
  } catch (error) {
    // Log dell'errore per debugging
    console.error("Errore nella chiamata API di login:", error);
    // Rilancia l'errore
    throw error;
  }
};

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () => fetchWithAuth('/auth/me');

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    // Utilizza fetchWithAuth per ottenere i dati dell'utente
    const data = await fetchWithAuth('/auth/me');
    // Restituisce i dati dell'utente
    return data;
  } catch (error) {
    // Log dell'errore per debugging
    console.error('Errore nel recupero dei dati utente:', error);
    // Rilancia l'errore
    throw error;
  }
};