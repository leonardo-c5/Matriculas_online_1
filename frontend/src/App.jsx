import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Users, UserPlus, FileText, FileBarChart, Settings, Search, Bell, CheckCircle, AlertCircle, Clock, Layers, Calendar, Shield, Activity, Folder } from 'lucide-react';

// ==========================================
// VISTA 1: PORTAL PÚBLICO (Matrícula con Apoderado)
// ==========================================
const PortalPublico = () => {
  const [formData, setFormData] = useState({
    primer_nombre: '', segundo_nombre: '', apellido_paterno: '', apellido_materno: '', 
    tipo_documento: 'DNI', numero_documento: '', fecha_nacimiento: '', grado: '1° Sec',
    apo_nombres: '', apo_apellidos: '', apo_dni: '', apo_telefono: '', apo_correo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['primer_nombre', 'segundo_nombre', 'apellido_paterno', 'apellido_materno', 'apo_nombres', 'apo_apellidos'].includes(name)) {
      setFormData({ ...formData, [name]: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') }); return;
    }
    if (name === 'numero_documento' || name === 'apo_dni' || name === 'apo_telefono') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') }); return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.numero_documento.length !== 8) {
      alert("El DNI del estudiante debe tener exactamente 8 dígitos."); return;
    }
    
    // Guardamos estudiante y apoderado de forma integrada
    fetch('http://localhost:3000/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      alert("¡Ficha de matrícula y datos del apoderado enviados con éxito!");
      setFormData({
        primer_nombre: '', segundo_nombre: '', apellido_paterno: '', apellido_materno: '', 
        tipo_documento: 'DNI', numero_documento: '', fecha_nacimiento: '', grado: '1° Sec',
        apo_nombres: '', apo_apellidos: '', apo_dni: '', apo_telefono: '', apo_correo: ''
      });
    });
  };

  return (
    <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#0f172a', margin: '0 0 10px 0', fontSize: '32px' }}>I.E. San Luis Gonzaga</h1>
          <p style={{ color: '#64748b', fontSize: '18px', margin: 0 }}>Portal de Matrícula Web y Admisión</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* SECCIÓN 1: DATOS DEL ESTUDIANTE */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' }}>1. Datos del Estudiante</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input name="primer_nombre" placeholder="Primer Nombre *" value={formData.primer_nombre} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="segundo_nombre" placeholder="Segundo Nombre" value={formData.segundo_nombre} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="apellido_paterno" placeholder="Apellido Paterno *" value={formData.apellido_paterno} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="apellido_materno" placeholder="Apellido Materno *" value={formData.apellido_materno} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="numero_documento" placeholder="Número de DNI (8 dígitos) *" value={formData.numero_documento} onChange={handleChange} maxLength={8} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="date" name="fecha_nacimiento" max={new Date().toISOString().split("T")[0]} value={formData.fecha_nacimiento} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select name="grado" value={formData.grado} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', gridColumn: '1 / -1' }}>
                <option value="1° Sec">1° Secundaria</option>
                <option value="2° Sec">2° Secundaria</option>
                <option value="3° Sec">3° Secundaria</option>
                <option value="4° Sec">4° Secundaria</option>
                <option value="5° Sec">5° Secundaria</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DEL APODERADO */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' }}>2. Datos del Padre o Apoderado</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input name="apo_nombres" placeholder="Nombres del Apoderado *" value={formData.apo_nombres} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="apo_apellidos" placeholder="Apellidos del Apoderado *" value={formData.apo_apellidos} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="apo_dni" placeholder="DNI del Apoderado *" value={formData.apo_dni} onChange={handleChange} maxLength={8} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="apo_telefono" placeholder="Teléfono de Contacto *" value={formData.apo_telefono} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="email" name="apo_correo" placeholder="Correo Electrónico" value={formData.apo_correo} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', gridColumn: '1 / -1' }} />
            </div>
          </div>

          <button type="submit" style={{ padding: '15px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Enviar Solicitud de Matrícula Completa
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Acceso Administrativo Privado</Link>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// VISTA 2: PANTALLA DE LOGIN
// ==========================================
const PantallaLogin = ({ setAutorizado }) => {
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
};

// ==========================================
// VISTA 3: DASHBOARD ADMINISTRATIVO ERP
// ==========================================
const DashboardAdmin = ({ setAutorizado }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [moduloActivo, setModuloActivo] = useState('panel'); 
  const navigate = useNavigate();

  const cargarDatos = () => {
    fetch('http://localhost:3000/api/estudiantes')
      .then(res => res.json())
      .then(data => setEstudiantes(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { cargarDatos(); }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    fetch(`http://localhost:3000/api/estudiantes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    }).then(() => cargarDatos()).catch(err => console.error(err));
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Matriculas');
    worksheet.mergeCells('A1:H1');
    const titulo = worksheet.getCell('A1');
    titulo.value = 'I.E. San Luis Gonzaga - Reporte General';
    titulo.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF2B6CB0' } };
    titulo.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A2:H2');
    const fecha = worksheet.getCell('A2');
    fecha.value = `Fecha de Generación: ${new Date().toLocaleString()}`;
    fecha.font = { italic: true, color: { argb: 'FF4A5568' } };
    fecha.alignment = { horizontal: 'center' };
    
    worksheet.getRow(4).values = ['DNI Estudiante', 'Estudiante', 'Grado', 'Apoderado', 'DNI Apoderado', 'Teléfono', 'Correo', 'Estado'];
    worksheet.getRow(4).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A365D' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    
    estudiantes.forEach(est => {
      worksheet.addRow([
        est.numero_documento, `${est.apellido_paterno} ${est.primer_nombre}`, est.grado || '-',
        `${est.apo_apellidos || ''} ${est.apo_nombres || '-'}`, est.apo_dni || '-', est.apo_telefono || '-', est.apo_correo || '-', est.estado || 'En proceso'
      ]);
    });
    
    worksheet.columns.forEach((column) => {
      column.width = 18;
      column.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_General_Matriculas.xlsx');
  };

  const estudiantesFiltrados = estudiantes.filter(est => est.numero_documento.includes(busqueda) || est.apellido_paterno.toLowerCase().includes(busqueda.toLowerCase()));

  const total = estudiantes.length;
  const aprobadasCount = estudiantes.filter(e => e.estado === 'Aprobada').length;
  const procesoCount = estudiantes.filter(e => e.estado === 'En proceso' || !e.estado).length;
  const observadasCount = estudiantes.filter(e => e.estado === 'Observada').length;

  const pieData = [
    { name: 'Aprobadas', value: aprobadasCount, color: '#10b981' },
    { name: 'En proceso', value: procesoCount, color: '#3b82f6' },
    { name: 'Observadas', value: observadasCount, color: '#f59e0b' }
  ];

  const gradosList = ['1° Sec', '2° Sec', '3° Sec', '4° Sec', '5° Sec'];
  const barData = gradosList.map(grado => ({ name: grado, val: estudiantes.filter(e => e.grado === grado).length }));

  const MenuItem = ({ id, icon: Icon, text }) => (
    <div onClick={() => setModuloActivo(id)}
      style={{ padding: '12px 15px', borderRadius: '8px', backgroundColor: moduloActivo === id ? '#1d4ed8' : 'transparent', color: moduloActivo === id ? 'white' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '4px' }}>
      <Icon size={18} />
      <span style={{ fontSize: '14px', fontWeight: moduloActivo === id ? '600' : '400' }}>{text}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SIG</div>
          <div><h3 style={{ margin: 0, fontSize: '15px' }}>Colegio</h3><p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>San Luis Gonzaga</p></div>
        </div>
        <div style={{ padding: '20px 15px', overflowY: 'auto', flex: 1 }}>
          <MenuItem id="panel" icon={Home} text="1. Panel principal" />
          <MenuItem id="matriculas" icon={FileText} text="2. Matrículas" />
          <MenuItem id="estudiantes" icon={Users} text="3. Estudiantes" />
          <MenuItem id="apoderados" icon={UserPlus} text="4. Apoderados" />
          <MenuItem id="documentos" icon={Folder} text="5. Documentos" />
          <MenuItem id="grados" icon={Layers} text="6. Grados y secciones" />
          <MenuItem id="periodos" icon={Calendar} text="7. Periodos académicos" />
          <MenuItem id="usuarios" icon={Shield} text="8. Usuarios y roles" />
          <MenuItem id="reportes" icon={FileBarChart} text="9. Reportes" />
          <MenuItem id="auditoria" icon={Activity} text="10. Auditoría del sistema" />
          <MenuItem id="notificaciones" icon={Bell} text="11. Notificaciones" />
          <MenuItem id="configuracion" icon={Settings} text="12. Configuración" />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* TOPBAR */}
        <div style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '20px', width: '400px' }}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Buscar..." style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '10px', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setAutorizado(false); navigate('/'); }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Administrador</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Cerrar Sesión</p>
              </div>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></div>
            </div>
          </div>
        </div>

        {/* ESPACIO DINÁMICO DE MÓDULOS */}
        <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
          
          {/* MÓDULO 1: PANEL PRINCIPAL */}
          {moduloActivo === 'panel' && (
            <>
              <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>Panel de Control General</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '10px', color: '#3b82f6' }}><Users size={24} /></div><div><p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Solicitudes Recibidas</p><h2 style={{ margin: 0, color: '#0f172a' }}>{total}</h2></div></div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ padding: '15px', backgroundColor: '#ecfdf5', borderRadius: '10px', color: '#10b981' }}><CheckCircle size={24} /></div><div><p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Matrículas Aprobadas</p><h2 style={{ margin: 0, color: '#0f172a' }}>{aprobadasCount}</h2></div></div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ padding: '15px', backgroundColor: '#fffbeb', borderRadius: '10px', color: '#f59e0b' }}><Clock size={24} /></div><div><p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Pendientes / Proceso</p><h2 style={{ margin: 0, color: '#0f172a' }}>{procesoCount}</h2></div></div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}><div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '10px', color: '#ef4444' }}><AlertCircle size={24} /></div><div><p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Observadas</p><h2 style={{ margin: 0, color: '#0f172a' }}>{observadasCount}</h2></div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Estado de Matrículas</h3>
                  {total > 0 ? ( <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> ) : <p>Sin datos</p>}
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Matrículas por grado</h3>
                  {total > 0 ? ( <ResponsiveContainer width="100%" height={200}><BarChart data={barData}><XAxis dataKey="name" axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="val" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} /></BarChart></ResponsiveContainer> ) : <p>Sin datos</p>}
                </div>
              </div>
            </>
          )}

          {/* MÓDULO 2: MATRÍCULAS */}
          {moduloActivo === 'matriculas' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Gestión de Solicitudes de Matrícula</h2>
                <button onClick={exportarExcel} style={{ padding: '8px 15px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Exportar Reporte General</button>
              </div>
              <input type="text" placeholder="Buscar por DNI o Apellido..." value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', marginBottom: '20px', boxSizing: 'border-box' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>DNI</th><th style={{ padding: '12px 10px' }}>Estudiante</th><th style={{ padding: '12px 10px' }}>Grado</th><th style={{ padding: '12px 10px' }}>Estado</th><th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.numero_documento}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apellido_paterno} {est.primer_nombre}</td>
                      <td style={{ padding: '15px 10px' }}>{est.grado || '-'}</td>
                      <td style={{ padding: '15px 10px' }}><span style={{ backgroundColor: est.estado === 'Aprobada' ? '#dcfce7' : est.estado === 'Observada' ? '#fef2f2' : '#eff6ff', color: est.estado === 'Aprobada' ? '#166534' : est.estado === 'Observada' ? '#991b1b' : '#1e40af', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{est.estado || 'En proceso'}</span></td>
                      <td style={{ padding: '15px 10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button onClick={() => cambiarEstado(est.id_alumno, 'Aprobada')} style={{ padding: '6px 10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Aprobar</button>
                        <button onClick={() => cambiarEstado(est.id_alumno, 'Observada')} style={{ padding: '6px 10px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Observar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MÓDULO 3: ESTUDIANTES (Padrón oficial) */}
          {moduloActivo === 'estudiantes' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>Padrón Oficial de Estudiantes Matriculados</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>DNI</th><th style={{ padding: '12px 10px' }}>Apellidos y Nombres</th><th style={{ padding: '12px 10px' }}>Grado Asignado</th><th style={{ padding: '12px 10px' }}>F. Nacimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.numero_documento}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apellido_paterno} {est.apellido_materno}, {est.primer_nombre} {est.segundo_nombre}</td>
                      <td style={{ padding: '15px 10px' }}>{est.grado || 'No asignado'}</td>
                      <td style={{ padding: '15px 10px' }}>{new Date(est.fecha_nacimiento).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MÓDULO 4: APODERADOS (Datos vinculados reales) */}
          {moduloActivo === 'apoderados' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>Directorio de Apoderados Registrados</h2>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>Información de contacto de los padres de familia vinculados a las solicitudes de matrícula.</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>DNI Apoderado</th>
                    <th style={{ padding: '12px 10px' }}>Apellidos y Nombres</th>
                    <th style={{ padding: '12px 10px' }}>Teléfono</th>
                    <th style={{ padding: '12px 10px' }}>Correo</th>
                    <th style={{ padding: '12px 10px' }}>Estudiante Vinculado</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.apo_dni || 'S/N'}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apo_apellidos || 'No registrado'} {est.apo_nombres || ''}</td>
                      <td style={{ padding: '15px 10px' }}>{est.apo_telefono || '-'}</td>
                      <td style={{ padding: '15px 10px' }}>{est.apo_correo || '-'}</td>
                      <td style={{ padding: '15px 10px', color: '#2563eb', fontWeight: '500' }}>{est.apellido_paterno} {est.primer_nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MÓDULOS 5 AL 12 */}
          {['documentos', 'grados', 'periodos', 'usuarios', 'reportes', 'auditoria', 'notificaciones', 'configuracion'].includes(moduloActivo) && (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Settings size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} />
              <h2 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>Módulo en Fase de Integración</h2>
              <p style={{ color: '#64748b' }}>Estructura lista según los requerimientos del SRS institucional.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ==========================================
export default function App() {
  const [autorizado, setAutorizado] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPublico />} />
        <Route path="/login" element={<PantallaLogin setAutorizado={setAutorizado} />} />
        <Route path="/admin" element={autorizado ? <DashboardAdmin setAutorizado={setAutorizado} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}