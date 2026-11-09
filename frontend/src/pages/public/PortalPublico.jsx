import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, ShieldCheck, Check } from 'lucide-react';

export default function PortalPublico() {
  const [formData, setFormData] = useState({
    primer_nombre: '', segundo_nombre: '', apellido_paterno: '', apellido_materno: '', 
    tipo_documento: 'DNI', numero_documento: '', fecha_nacimiento: '', grado: '1° Sec',
    apo_nombres: '', apo_apellidos: '', apo_dni: '', apo_telefono: '', apo_correo: ''
  });
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['primer_nombre', 'segundo_nombre', 'apellido_paterno', 'apellido_materno', 'apo_nombres', 'apo_apellidos'].includes(name)) {
      setFormData({ ...formData, [name]: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') }); return;
    }
    if (name === 'numero_documento' || name === 'apo_dni') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '').slice(0, 8) }); return;
    }
    if (name === 'apo_telefono') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '').slice(0, 9) }); return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.numero_documento.length !== 8) {
      alert("Error: El DNI del estudiante debe tener 8 dígitos."); return;
    }
    if (formData.apo_telefono.length !== 9 || !formData.apo_telefono.startsWith('9')) {
      alert("Error: El celular debe tener 9 dígitos y empezar con 9 (Formato Perú)."); return;
    }
    if (!terminosAceptados) {
      alert("Debe aceptar la Política de Privacidad de Datos para continuar."); return;
    }
    
    fetch('http://localhost:3000/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      alert("¡Ficha de matrícula enviada con éxito! Su solicitud está en revisión.");
      setFormData({
        primer_nombre: '', segundo_nombre: '', apellido_paterno: '', apellido_materno: '', 
        tipo_documento: 'DNI', numero_documento: '', fecha_nacimiento: '', grado: '1° Sec',
        apo_nombres: '', apo_apellidos: '', apo_dni: '', apo_telefono: '', apo_correo: ''
      });
      setTerminosAceptados(false);
    });
  };

  const inputStyle = { padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', color: '#334155', transition: 'all 0.3s', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#e2e8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <style>
        {`
          input:focus, select:focus { outline: none; border-color: #2563eb; background-color: #fff; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
          input[type="date"]::-webkit-calendar-picker-indicator { background-color: #2563eb; padding: 6px; cursor: pointer; border-radius: 6px; filter: invert(1); }
        `}
      </style>

      <div style={{ maxWidth: '850px', width: '100%', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '40px 30px', textAlign: 'center', color: 'white', position: 'relative' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>I.E. San Luis Gonzaga</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '18px' }}>Sistema Integrado de Matrícula y Admisión 2026</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#1e293b' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px' }}><User size={20} color="#2563eb" /></div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>1. Datos del Postulante</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <input name="primer_nombre" placeholder="Primer Nombre *" value={formData.primer_nombre} onChange={handleChange} required style={inputStyle} />
              <input name="segundo_nombre" placeholder="Segundo Nombre" value={formData.segundo_nombre} onChange={handleChange} style={inputStyle} />
              <input name="apellido_paterno" placeholder="Apellido Paterno *" value={formData.apellido_paterno} onChange={handleChange} required style={inputStyle} />
              <input name="apellido_materno" placeholder="Apellido Materno *" value={formData.apellido_materno} onChange={handleChange} required style={inputStyle} />
              <input name="numero_documento" placeholder="Número de DNI (8 dígitos) *" value={formData.numero_documento} onChange={handleChange} minLength={8} maxLength={8} required style={inputStyle} />
              <input type="date" name="fecha_nacimiento" max={new Date().toISOString().split("T")[0]} value={formData.fecha_nacimiento} onChange={handleChange} required style={inputStyle} />
              <select name="grado" value={formData.grado} onChange={handleChange} style={{ ...inputStyle, gridColumn: '1 / -1' }}>
                <option value="1° Sec">1° Secundaria</option>
                <option value="2° Sec">2° Secundaria</option>
                <option value="3° Sec">3° Secundaria</option>
                <option value="4° Sec">4° Secundaria</option>
                <option value="5° Sec">5° Secundaria</option>
              </select>
            </div>
          </div>
          <div style={{ padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#1e293b' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '8px' }}><Users size={20} color="#16a34a" /></div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>2. Datos del Padre o Apoderado Legal</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <input name="apo_nombres" placeholder="Nombres Completos *" value={formData.apo_nombres} onChange={handleChange} required style={inputStyle} />
              <input name="apo_apellidos" placeholder="Apellidos Completos *" value={formData.apo_apellidos} onChange={handleChange} required style={inputStyle} />
              <input name="apo_dni" placeholder="DNI del Apoderado *" value={formData.apo_dni} onChange={handleChange} minLength={8} maxLength={8} required style={inputStyle} />
              <input name="apo_telefono" placeholder="Celular (Ej: 987654321) *" value={formData.apo_telefono} onChange={handleChange} minLength={9} maxLength={9} required style={inputStyle} />
              <input type="email" name="apo_correo" placeholder="Correo Electrónico Activo" value={formData.apo_correo} onChange={handleChange} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
            </div>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <input type="checkbox" id="terminos" checked={terminosAceptados} onChange={(e) => setTerminosAceptados(e.target.checked)} style={{ marginTop: '5px', width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="terminos" style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', cursor: 'pointer' }}>
              <strong>Declaración Jurada y Privacidad:</strong> Declaro que la información proporcionada es verdadera. Autorizo a la I.E. San Luis Gonzaga el tratamiento de estos datos personales única y exclusivamente para el proceso de admisión y matrícula, conforme a la Ley N° 29733 (Ley de Protección de Datos Personales del Perú).
            </label>
          </div>
          <button type="submit" style={{ padding: '18px', backgroundColor: terminosAceptados ? '#2563eb' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: terminosAceptados ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            {terminosAceptados ? <Check size={20} /> : <ShieldCheck size={20} />}
            Completar Solicitud de Matrícula
          </button>
        </form>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Link to="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Acceso Administrativo Privado</Link>
        </div>
      </div>
    </div>
  );
}