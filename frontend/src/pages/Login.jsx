import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";

// Importa l'URL dell'API dalla variabile d'ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "", // Stato iniziale del campo email
    password: "", // Stato iniziale del campo password
  });

  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina
  const location = useLocation(); // NEW! Per accedere ai parametri dell'URL corrente

  useEffect(() => {
    // Questo effect viene eseguito dopo il rendering del componente
    // e ogni volta che location o navigate cambiano

    // Estraiamo i parametri dall'URL
    const params = new URLSearchParams(location.search);
    // Cerchiamo un parametro 'token' nell'URL
    const token = params.get("token");
    console.log('Received token:', token);

    if (token) {
      // Se troviamo un token, lo salviamo nel localStorage
      localStorage.setItem("token", token);
      console.log('Token saved, navigating to home');
      // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("loginStateChange"));
      // Navighiamo alla home page
      navigate("/");
    }
  }, [location, navigate]); // Questo effect dipende da location e navigate

  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };

  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      console.log("Login effettuato con successo!"); // Mostra un messaggio di successo
      navigate("/"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  // Funzione aggiornata per gestire il login con Google
 const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/api/auth/google`;
};

  // Funzione aggiornata per gestire il login con GitHub
  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div className="container">
      <h2>Login per il blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Accedi</button>
      </form>
      {/* NEW! */}
      <button onClick={handleGoogleLogin}>Accedi con Google</button>
      <button onClick={handleGitHubLogin}>Accedi con GitHub</button>
    </div>
  );
}
