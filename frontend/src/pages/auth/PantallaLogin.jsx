import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PantallaLogin({ setAutorizado }) {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = () => {
    if (password === 'sanluis2026') {
      setAutorizado(true);
      navigate('/admin');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: 'Segoe UI' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', width: '380px', textAlign: 'center' }}>
        <h2 style={{ color: '#1e293b', margin: '0 0 10px 0', fontSize: '24px' }}>San Luis Gonzaga</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Dashboard Administrativo</p>
        <input type="password" placeholder="Contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && manejarLogin()} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        <button onClick={manejarLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Iniciar Sesión</button>
      </div>
    </div>
  );
}