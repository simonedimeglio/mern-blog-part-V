import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/api';

function CompleteProfile() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ email });
      navigate('/');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
    }
  };

  return (
    <div>
      <h2>Completa il tuo profilo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Inserisci la tua email"
          required
        />
        <button type="submit">Salva</button>
      </form>
    </div>
  );
}

export default CompleteProfile;