// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa Link da react-router-dom per la navigazione
import { Link } from "react-router-dom";
// Importo la funzione getPosts dal mio file services/api
import { getPosts } from "../services/api";
// Importa il file CSS per gli stili specifici di questo componente
import "./Home.css";

export default function Home() {
  // Stato per memorizzare l'array dei post
  const [posts, setPosts] = useState([]);

  // Effect hook per fetchare i post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere tutti i post
        const response = await getPosts();
        // Aggiorna lo stato con i dati dei post
        setPosts(response.data);
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post:", error);
      }
    };
    // Chiamiamo la funzione fetchPosts
    fetchPosts();
  }, []); // L'array vuoto come secondo argomento significa che questo effect si esegue solo al mount del componente

  // Rendering del componente
  return (
    <div className="container">
      <h1>Lista dei Post</h1>
      <div className="post-grid">
        {/* Mappa attraverso l'array dei post e crea un elemento per ciascuno */}
        {posts.map((post) => (
          // Link wrappa ogni post, permettendo la navigazione alla pagina di dettaglio
          <Link to={`/post/${post._id}`} key={post._id} className="post-card">
            {/* Immagine di copertina del post */}
            <img src={post.cover} alt={post.title} className="post-image" />
            <div className="post-content">
              {/* Titolo del post */}
              <h2>{post.title}</h2>
              {/* Autore del post */}
              <p>Autore: {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
