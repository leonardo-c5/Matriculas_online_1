import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Users, UserPlus, FileText, FileBarChart, Settings, Search, Bell, CheckCircle, AlertCircle, Clock, Layers, Calendar, Shield, Activity, Folder, X } from 'lucide-react';

export default function DashboardAdmin({ setAutorizado }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [moduloActivo, setModuloActivo] = useState('panel'); 
  
  // Estados para los Modales Profesionales
  const [mostrarModalGrado, setMostrarModalGrado] = useState(false);
  const [mostrarModalAprobar, setMostrarModalAprobar] = useState(false);
  const [mostrarModalObservar, setMostrarModalObservar] = useState(false);
  const [mostrarModalObservarDoc, setMostrarModalObservarDoc] = useState(false);
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [mostrarModalPeriodo, setMostrarModalPeriodo] = useState(false);
  const [mostrarModalEstadoUsuario, setMostrarModalEstadoUsuario] = useState(false);
  
  // Estados de captura de datos
  const [nuevoGrado, setNuevoGrado] = useState({ grado: '', seccion: '', capacidad: 30 });
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombres: '', correo: '', password: '', rol: 'Secretaria' });
  const [nuevoPeriodo, setNuevoPeriodo] = useState({ nombre_periodo: '', fecha_inicio: '', fecha_fin: '' });
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [motivoObservacion, setMotivoObservacion] = useState('');
  const [motivoObservacionDoc, setMotivoObservacionDoc] = useState('');

  const navigate = useNavigate();

  const cargarDatos = () => {
    fetch('http://localhost:3000/api/estudiantes')
      .then(res => res.json())
      .then(data => setEstudiantes(data))
      .catch(err => console.error(err));
      
    fetch('http://localhost:3000/api/documentos')
      .then(res => res.json())
      .then(data => setDocumentos(data))
      .catch(err => console.error(err));

    fetch('http://localhost:3000/api/grados')
      .then(res => res.json())
      .then(data => setGrados(data))
      .catch(err => console.error(err));

    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error(err));

    fetch('http://localhost:3000/api/periodos')
      .then(res => res.json())
      .then(data => setPeriodos(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { cargarDatos(); }, []);

  // REINICIAR EL BUSCADOR AUTOMÁTICAMENTE AL CAMBIAR DE MÓDULO
  useEffect(() => {
    setBusquedaGlobal('');
  }, [moduloActivo]);

  // Lógica para Aprobar Matrícula y Asignar Vacante
  const confirmarAprobacion = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/grados/asignar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_alumno: alumnoSeleccionado, id_aula: parseInt(aulaSeleccionada) })
    })
    .then(res => res.json())
    .then(() => {
      setMostrarModalAprobar(false);
      setAulaSeleccionada('');
      cargarDatos();
    })
    .catch(err => console.error("Error al aprobar:", err));
  };

  // Lógica para Observar Expediente (Matrícula)
  const confirmarObservacion = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/estudiantes/${alumnoSeleccionado}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Observada', observacion: motivoObservacion })
    }).then(() => {
      setMostrarModalObservar(false);
      setMotivoObservacion('');
      cargarDatos();
    }).catch(err => console.error(err));
  };

  // Lógica para Cambiar Estado de Documentos (Validar)
  const validarDocumento = (id_documento) => {
      fetch(`http://localhost:3000/api/documentos/${id_documento}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'Validado', observacion: '' })
      })
      .then(res => res.json())
      .then(() => cargarDatos())
      .catch(err => console.error("Error al actualizar documento:", err));
  };

  // Lógica para Cambiar Estado de Documentos (Observar)
  const confirmarObservacionDoc = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/documentos/${documentoSeleccionado}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Observado', observacion: motivoObservacionDoc })
    }).then(() => {
      setMostrarModalObservarDoc(false);
      setMotivoObservacionDoc('');
      cargarDatos();
    }).catch(err => console.error(err));
  };

  const guardarNuevaSeccion = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/grados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGrado)
    })
    .then(res => res.json())
    .then(() => {
      cargarDatos();
      setMostrarModalGrado(false);
      setNuevoGrado({ grado: '', seccion: '', capacidad: 30 });
    })
    .catch(err => console.error("Error al crear:", err));
  };

  const guardarNuevoUsuario = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    })
    .then(res => {
        if(!res.ok) throw new Error("Error al crear usuario (quizás el correo ya existe)");
        return res.json();
    })
    .then(() => {
      cargarDatos();
      setMostrarModalUsuario(false);
      setNuevoUsuario({ nombres: '', correo: '', password: '', rol: 'Secretaria' });
    })
    .catch(err => {
        console.error(err);
        alert("Hubo un error. Asegúrate de que el correo no esté repetido.");
    });
  };

  const guardarNuevoPeriodo = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/periodos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPeriodo)
    })
    .then(res => res.json())
    .then(() => {
      cargarDatos();
      setMostrarModalPeriodo(false);
      setNuevoPeriodo({ nombre_periodo: '', fecha_inicio: '', fecha_fin: '' });
    })
    .catch(err => console.error("Error al crear periodo:", err));
  };

  const activarPeriodoEscolar = (id_periodo) => {
    fetch(`http://localhost:3000/api/periodos/${id_periodo}/activar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(() => cargarDatos())
    .catch(err => console.error("Error al activar periodo:", err));
  };

  const manejarAccionUsuario = (usr) => {
      setUsuarioSeleccionado(usr);
      setMostrarModalEstadoUsuario(true);
  };

  const ejecutarCambioEstado = () => {
      if (!usuarioSeleccionado) return;
      const nuevoEstado = (usuarioSeleccionado.estado === 'Activo' || !usuarioSeleccionado.estado) ? 'Inactivo' : 'Activo';

      fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.id_usuario}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado })
      })
      .then(res => res.json())
      .then(() => {
          setMostrarModalEstadoUsuario(false);
          setUsuarioSeleccionado(null);
          cargarDatos();
      })
      .catch(err => console.error("Error al cambiar estado:", err));
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

  // ==========================================
  // FILTROS DE BÚSQUEDA GLOBAL AVANZADA
  // ==========================================
  const textoBusq = busquedaGlobal.toLowerCase();

  const estudiantesFiltrados = estudiantes.filter(est => 
    (est.numero_documento && est.numero_documento.toLowerCase().includes(textoBusq)) ||
    (est.apellido_paterno && est.apellido_paterno.toLowerCase().includes(textoBusq)) ||
    (est.primer_nombre && est.primer_nombre.toLowerCase().includes(textoBusq)) ||
    (est.grado && est.grado.toLowerCase().includes(textoBusq)) ||
    (est.estado && est.estado.toLowerCase().includes(textoBusq))
  );

  const documentosFiltrados = documentos.filter(doc =>
    (doc.apellido_paterno && doc.apellido_paterno.toLowerCase().includes(textoBusq)) ||
    (doc.primer_nombre && doc.primer_nombre.toLowerCase().includes(textoBusq)) ||
    (doc.numero_documento && doc.numero_documento.toLowerCase().includes(textoBusq)) ||
    (doc.tipo_documento && doc.tipo_documento.toLowerCase().includes(textoBusq)) ||
    (doc.estado && doc.estado.toLowerCase().includes(textoBusq))
  );

  const periodosFiltrados = periodos.filter(per =>
    (per.nombre_periodo && per.nombre_periodo.toLowerCase().includes(textoBusq)) ||
    (per.estado && per.estado.toLowerCase().includes(textoBusq))
  );

  const usuariosFiltrados = usuarios.filter(usr =>
    (usr.nombres && usr.nombres.toLowerCase().includes(textoBusq)) ||
    (usr.email && usr.email.toLowerCase().includes(textoBusq)) ||
    (usr.rol && usr.rol.toLowerCase().includes(textoBusq)) ||
    (usr.estado && usr.estado.toLowerCase().includes(textoBusq))
  );

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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* HEADER CON BUSCADOR GLOBAL */}
        <div style={{ height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '8px 15px', borderRadius: '20px', width: '400px' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Búsqueda avanzada global (DNI, nombres...)" 
              value={busquedaGlobal}
              onChange={(e) => setBusquedaGlobal(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '10px', width: '100%' }} 
            />
            {busquedaGlobal && (
              <X size={16} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setBusquedaGlobal('')} />
            )}
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

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ padding: '30px', overflowY: 'auto', flex: 1, position: 'relative' }}>
          
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

          {moduloActivo === 'matriculas' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Gestión de Solicitudes de Matrícula</h2>
                <button onClick={exportarExcel} style={{ padding: '8px 15px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Exportar Reporte General</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>DNI</th><th style={{ padding: '12px 10px' }}>Estudiante</th><th style={{ padding: '12px 10px' }}>Grado</th><th style={{ padding: '12px 10px' }}>Estado</th><th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.length > 0 ? estudiantesFiltrados.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.numero_documento}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apellido_paterno} {est.primer_nombre}</td>
                      <td style={{ padding: '15px 10px' }}>{est.grado || '-'}</td>
                      <td style={{ padding: '15px 10px' }}>
                        <span style={{ backgroundColor: est.estado === 'Aprobada' ? '#dcfce7' : est.estado === 'Observada' ? '#fef2f2' : '#eff6ff', color: est.estado === 'Aprobada' ? '#166534' : est.estado === 'Observada' ? '#991b1b' : '#1e40af', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                          {est.estado || 'En proceso'}
                        </span>
                        {est.estado === 'Observada' && est.observacion && (
                          <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', maxWidth: '150px' }}>
                            Motivo: {est.observacion}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '15px 10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => { setAlumnoSeleccionado(est.id_alumno); setMostrarModalAprobar(true); }} 
                          disabled={est.estado === 'Aprobada'}
                          style={{ padding: '6px 10px', backgroundColor: est.estado === 'Aprobada' ? '#cbd5e1' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: est.estado === 'Aprobada' ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Aprobar
                        </button>
                        <button 
                          onClick={() => { setAlumnoSeleccionado(est.id_alumno); setMotivoObservacion(''); setMostrarModalObservar(true); }} 
                          style={{ padding: '6px 10px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Observar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron solicitudes coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

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
                  {estudiantesFiltrados.length > 0 ? estudiantesFiltrados.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.numero_documento}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apellido_paterno} {est.apellido_materno}, {est.primer_nombre} {est.segundo_nombre}</td>
                      <td style={{ padding: '15px 10px' }}>{est.grado || 'No asignado'}</td>
                      <td style={{ padding: '15px 10px' }}>{new Date(est.fecha_nacimiento).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron estudiantes coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {moduloActivo === 'apoderados' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>Directorio de Apoderados Registrados</h2>
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
                  {estudiantesFiltrados.length > 0 ? estudiantesFiltrados.map(est => (
                    <tr key={est.id_alumno} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px' }}>{est.apo_dni || 'S/N'}</td>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{est.apo_apellidos || 'No registrado'} {est.apo_nombres || ''}</td>
                      <td style={{ padding: '15px 10px' }}>{est.apo_telefono || '-'}</td>
                      <td style={{ padding: '15px 10px' }}>{est.apo_correo || '-'}</td>
                      <td style={{ padding: '15px 10px', color: '#2563eb', fontWeight: '500' }}>{est.apellido_paterno} {est.primer_nombre}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron apoderados coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {moduloActivo === 'documentos' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>5. Módulo de Documentos y Requisitos</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>Estudiante</th>
                    <th style={{ padding: '12px 10px' }}>DNI</th>
                    <th style={{ padding: '12px 10px' }}>Tipo de Documento</th>
                    <th style={{ padding: '12px 10px' }}>Estado de Revisión</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones de Validación</th>
                  </tr>
                </thead>
                <tbody>
                  {documentosFiltrados.length > 0 ? documentosFiltrados.map(doc => (
                    <tr key={doc.id_documento} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px 10px', fontWeight: '500' }}>{doc.apellido_paterno} {doc.primer_nombre}</td>
                      <td style={{ padding: '15px 10px' }}>{doc.numero_documento}</td>
                      <td style={{ padding: '15px 10px' }}>{doc.tipo_documento}</td>
                      <td style={{ padding: '15px 10px' }}>
                        <span style={{ backgroundColor: doc.estado === 'Validado' ? '#dcfce7' : doc.estado === 'Observado' ? '#fef2f2' : '#eff6ff', color: doc.estado === 'Validado' ? '#166534' : doc.estado === 'Observado' ? '#991b1b' : '#1e40af', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                          {doc.estado}
                        </span>
                        {doc.estado === 'Observado' && doc.observacion && (
                          <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', maxWidth: '200px' }}>
                            Motivo: {doc.observacion}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '15px 10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                           disabled={doc.estado === 'Validado'}
                           onClick={() => validarDocumento(doc.id_documento)} 
                           style={{ padding: '6px 10px', backgroundColor: doc.estado === 'Validado' ? '#cbd5e1' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: doc.estado === 'Validado' ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600' }}>
                           Validar
                        </button>
                        <button 
                           onClick={() => { setDocumentoSeleccionado(doc.id_documento); setMotivoObservacionDoc(''); setMostrarModalObservarDoc(true); }} 
                           style={{ padding: '6px 10px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                           Observar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron documentos coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {moduloActivo === 'grados' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#0f172a', margin: 0 }}>Gestión de Aforos y Aulas</h2>
                <button onClick={() => setMostrarModalGrado(true)} style={{ padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Nueva Sección</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {grados.map(aula => {
                  const ocupadas = Number(aula.matriculados) || 0;
                  const totalMaximo = Number(aula.capacidad) || 30;
                  const porcentaje = (ocupadas / totalMaximo) * 100;
                  const colorBarra = porcentaje >= 90 ? '#ef4444' : porcentaje >= 70 ? '#f59e0b' : '#10b981';
                  
                  return (
                    <div key={aula.id_aula || aula.id} style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '20px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{aula.grado} - {aula.seccion}</h3>
                        <Layers size={20} color="#64748b" />
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                        <span>Ocupado: {ocupadas}</span>
                        <span>Total: {totalMaximo}</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcentaje}%`, backgroundColor: colorBarra, height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
                      </div>
                      <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                        {totalMaximo - ocupadas} vacantes disponibles
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MÓDULO 7: PERIODOS ACADÉMICOS */}
          {moduloActivo === 'periodos' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Gestión de Periodos Académicos</h2>
                <button onClick={() => setMostrarModalPeriodo(true)} style={{ padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} /> Nuevo Periodo
                </button>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>Año / Periodo Lectivo</th>
                    <th style={{ padding: '12px 10px' }}>Fecha de Inicio</th>
                    <th style={{ padding: '12px 10px' }}>Fecha de Cierre</th>
                    <th style={{ padding: '12px 10px' }}>Estado Institucional</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {periodosFiltrados.length > 0 ? periodosFiltrados.map(per => {
                    const esActivo = per.estado === 'Activo';
                    return (
                      <tr key={per.id_periodo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '15px 10px', fontWeight: '600', color: '#0f172a' }}>{per.nombre_periodo}</td>
                        <td style={{ padding: '15px 10px' }}>{per.fecha_inicio ? new Date(per.fecha_inicio).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '15px 10px' }}>{per.fecha_fin ? new Date(per.fecha_fin).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '15px 10px' }}>
                          <span style={{ backgroundColor: esActivo ? '#dcfce7' : '#f1f5f9', color: esActivo ? '#166534' : '#64748b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            {per.estado}
                          </span>
                        </td>
                        <td style={{ padding: '15px 10px', display: 'flex', justifyContent: 'center' }}>
                          <button 
                             onClick={() => activarPeriodoEscolar(per.id_periodo)}
                             disabled={esActivo}
                             style={{ padding: '6px 14px', backgroundColor: esActivo ? '#cbd5e1' : '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: esActivo ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600' }}>
                             {esActivo ? 'Periodo Vigente' : 'Establecer como Activo'}
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron periodos coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MÓDULO 8: USUARIOS Y ROLES */}
          {moduloActivo === 'usuarios' && (
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Gestión de Usuarios y Accesos</h2>
                <button onClick={() => setMostrarModalUsuario(true)} style={{ padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={16} /> Nuevo Usuario
                </button>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px' }}>Nombres del Personal</th>
                    <th style={{ padding: '12px 10px' }}>Correo Electrónico (Acceso)</th>
                    <th style={{ padding: '12px 10px' }}>Rol en el Sistema</th>
                    <th style={{ padding: '12px 10px' }}>Estado de la Cuenta</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length > 0 ? usuariosFiltrados.map(usr => {
                    const estaActivo = usr.estado === 'Activo' || !usr.estado;
                    return (
                      <tr key={usr.id_usuario} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '15px 10px', fontWeight: '500' }}>{usr.nombres}</td>
                        <td style={{ padding: '15px 10px' }}>{usr.email}</td>
                        <td style={{ padding: '15px 10px' }}>
                          <span style={{ backgroundColor: usr.rol === 'Administrador' ? '#f3e8ff' : '#f1f5f9', color: usr.rol === 'Administrador' ? '#7e22ce' : '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            {usr.rol}
                          </span>
                        </td>
                        <td style={{ padding: '15px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: estaActivo ? '#10b981' : '#ef4444' }}></div>
                            <span style={{ color: estaActivo ? '#0f172a' : '#64748b', fontWeight: '500' }}>{usr.estado || 'Activo'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '15px 10px', display: 'flex', justifyContent: 'center' }}>
                          <button 
                             onClick={() => manejarAccionUsuario(usr)}
                             style={{ padding: '6px 12px', backgroundColor: estaActivo ? '#fee2e2' : '#dcfce7', color: estaActivo ? '#b91c1c' : '#15803d', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}>
                             {estaActivo ? 'Suspender Acceso' : 'Reactivar Cuenta'}
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No se encontraron usuarios coincidentes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {['reportes', 'auditoria', 'notificaciones', 'configuracion'].includes(moduloActivo) && (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Settings size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} />
              <h2 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>Módulo en Fase de Integración</h2>
              <p style={{ color: '#64748b' }}>Estructura lista según los requerimientos del SRS institucional.</p>
            </div>
          )}

          {/* ============================================================
              MODALES PROFESIONALES CORPORATIVOS
          ============================================================= */}

          {/* MODAL 1: NUEVA SECCIÓN */}
          {mostrarModalGrado && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Registrar Nueva Sección</h2>
                  <button onClick={() => setMostrarModalGrado(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={guardarNuevaSeccion} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Nivel y Grado Académico *</label>
                    <select required value={nuevoGrado.grado} onChange={(e) => setNuevoGrado({...nuevoGrado, grado: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                      <option value="">Seleccione el grado...</option>
                      <option value="1° Sec">1° Secundaria</option>
                      <option value="2° Sec">2° Secundaria</option>
                      <option value="3° Sec">3° Secundaria</option>
                      <option value="4° Sec">4° Secundaria</option>
                      <option value="5° Sec">5° Secundaria</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Sección *</label>
                      <input required type="text" placeholder="Ej: A, B, C..." maxLength="1" value={nuevoGrado.seccion} onChange={(e) => setNuevoGrado({...nuevoGrado, seccion: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Aforo Máximo</label>
                      <input type="number" min="15" max="40" value={nuevoGrado.capacidad} onChange={(e) => setNuevoGrado({...nuevoGrado, capacidad: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarModalGrado(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Guardar Sección</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: APROBAR MATRÍCULA Y ASIGNAR AULA */}
          {mostrarModalAprobar && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Aprobar y Asignar Vacante</h2>
                  <button onClick={() => setMostrarModalAprobar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={confirmarAprobacion} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Seleccione el Aula Disponible *</label>
                    <select required value={aulaSeleccionada} onChange={(e) => setAulaSeleccionada(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                      <option value="">Seleccione un aula...</option>
                      {grados.filter(g => (g.capacidad - g.matriculados) > 0).map(g => (
                        <option key={g.id_aula} value={g.id_aula}>
                          {g.grado} - Sección {g.seccion} (Disponibles: {g.capacidad - g.matriculados})
                        </option>
                      ))}
                    </select>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#64748b' }}>Solo se muestran las aulas que aún cuentan con vacantes.</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarModalAprobar(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Confirmar Matrícula</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 3: OBSERVAR EXPEDIENTE MATRÍCULA */}
          {mostrarModalObservar && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Observar Expediente</h2>
                  <button onClick={() => setMostrarModalObservar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={confirmarObservacion} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Motivo de la observación *</label>
                    <textarea required placeholder="Ej. Faltó adjuntar la copia del DNI del apoderado..." value={motivoObservacion} onChange={(e) => setMotivoObservacion(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarModalObservar(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Guardar Observación</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 4: OBSERVAR DOCUMENTO ESPECÍFICO */}
          {mostrarModalObservarDoc && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Observar Documento</h2>
                  <button onClick={() => setMostrarModalObservarDoc(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={confirmarObservacionDoc} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Motivo (Ej: Firma faltante, borroso) *</label>
                    <textarea required placeholder="Ingrese el detalle del problema con el documento..." value={motivoObservacionDoc} onChange={(e) => setMotivoObservacionDoc(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarModalObservarDoc(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Registrar Observación</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 5: NUEVO USUARIO (SISTEMA) */}
          {mostrarModalUsuario && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Registrar Personal Administrativo</h2>
                  <button onClick={() => setMostrarModalUsuario(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={guardarNuevoUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Nombres Completos *</label>
                    <input required type="text" placeholder="Ej: Ana María Rojas..." value={nuevoUsuario.nombres} onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombres: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Correo Institucional (Login) *</label>
                    <input required type="email" placeholder="correo@colegio.edu.pe" value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Contraseña *</label>
                      <input required type="password" placeholder="Mínimo 6 caracteres" minLength="6" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Nivel de Acceso *</label>
                      <select required value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}>
                        <option value="Secretaria">Secretaría (Estándar)</option>
                        <option value="Administrador">Administrador (Total)</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                    <button type="button" onClick={() => setMostrarModalUsuario(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Crear Usuario</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: NUEVO PERIODO ACADÉMICO */}
          {mostrarModalPeriodo && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Registrar Nuevo Periodo Lectivo</h2>
                  <button onClick={() => setMostrarModalPeriodo(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                </div>
                <form onSubmit={guardarNuevoPeriodo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Nombre del Periodo *</label>
                    <input required type="text" placeholder="Ej: Año Escolar 2027" value={nuevoPeriodo.nombre_periodo} onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, nombre_periodo: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Fecha Inicio *</label>
                      <input required type="date" value={nuevoPeriodo.fecha_inicio} onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, fecha_inicio: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Fecha Fin *</label>
                      <input required type="date" value={nuevoPeriodo.fecha_fin} onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, fecha_fin: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                    <button type="button" onClick={() => setMostrarModalPeriodo(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
                    <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Guardar Periodo</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL INTELIGENTE DE CONFIRMACIÓN DE ESTADO DE USUARIO (SUSPENDER / REACTIVAR) */}
          {mostrarModalEstadoUsuario && usuarioSeleccionado && (() => {
            const estaActivo = usuarioSeleccionado.estado === 'Activo' || !usuarioSeleccionado.estado;
            return (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: estaActivo ? '#991b1b' : '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={22} /> {estaActivo ? 'Confirmar Revocación de Acceso' : 'Confirmar Reactivación de Cuenta'}
                    </h2>
                    <button onClick={() => setMostrarModalEstadoUsuario(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', marginBottom: '20px' }}>
                    {estaActivo ? (
                      <>
                        Estás a punto de suspender las credenciales administrativas de <strong style={{ color: '#0f172a' }}>{usuarioSeleccionado.nombres}</strong> ({usuarioSeleccionado.email}). 
                        <br/><br/>
                        Esta acción bloqueará de inmediato su ingreso al ERP institucional. ¿Deseas proceder con esta medida de seguridad?
                      </>
                    ) : (
                      <>
                        Estás a punto de reactivar las credenciales de acceso para <strong style={{ color: '#0f172a' }}>{usuarioSeleccionado.nombres}</strong> ({usuarioSeleccionado.email}). 
                        <br/><br/>
                        Esta acción devolverá los permisos de ingreso al ERP institucional. ¿Deseas confirmar la reactivación?
                      </>
                    )}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={() => setMostrarModalEstadoUsuario(false)} style={{ padding: '10px 15px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#334155' }}>Cancelar</button>
                    <button type="button" onClick={ejecutarCambioEstado} style={{ padding: '10px 15px', backgroundColor: estaActivo ? '#dc2626' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                      {estaActivo ? 'Sí, Suspender Acceso' : 'Sí, Reactivar Cuenta'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}