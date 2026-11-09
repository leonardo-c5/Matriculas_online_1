import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PortalPublico from './pages/public/PortalPublico';
import PantallaLogin from './pages/auth/PantallaLogin';
import DashboardAdmin from './pages/admin/DashboardAdmin';

export default function App() {
  const [autorizado, setAutorizado] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPublico />} />
        <Route path="/login" element={<PantallaLogin setAutorizado={setAutorizado} />} />
        <Route path="/admin" element={
          autorizado ? <DashboardAdmin setAutorizado={setAutorizado} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}