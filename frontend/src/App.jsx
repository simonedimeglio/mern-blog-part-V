// Importa i componenti necessari da react-router-dom per gestire il routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importa i componenti personalizzati dell'applicazione
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Importa il file CSS per gli stili dell'App
import "./App.css";

// Definisce il componente principale App
function App() {
  return (
    // Router avvolge l'intera applicazione, abilitando il routing
    <Router>
      <div className="App">
        {/* Navbar è renderizzato in tutte le pagine */}
        <Navbar />

        {/* Il tag main contiene il contenuto principale che cambia in base al routing */}
        <main>
          {/* Routes definisce le diverse rotte dell'applicazione */}
          <Routes>
            {/* Route per la pagina di registrazione */}
            <Route path="/register" element={<Register />} />

            {/* Route per la pagina di login */}
            <Route path="/login" element={<Login />} />

            {/* Route per la home page */}
            <Route path="/" element={<Home />} />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Esporta il componente App come default per essere utilizzato in altri file
export default App;
