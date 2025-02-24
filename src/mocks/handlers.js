import { http, HttpResponse } from 'msw';

const mockReportes = [
  {
    codigo: "XE707C",
    fechaCreacion: "2024-01-20 10:30:00",
    estado: "No leído",
    departamento: "Urgencias",
    professión: "Enfermeria",
    dateTime: "2024-01-20T10:30",
    lugar: "Sala de emergencias",
    asunto: "Mantenimiento",
    descripción: "Problema con aire acondicionado",
    isConsecuent: "no",
    tipoConsecuencia: "",
    evitable: "si",
    sugerent: "Realizar mantenimiento preventivo",
    archivo: [],
    flagged: false
  },
  {
    codigo: 'AB123C',
    asunto: 'Limpieza',
    descripcion: 'Limpieza pendiente en sala de espera',
    estado: 'En proceso',
    departamento: 'Limpieza',
    fechaCreacion: '2024-01-21 09:15:00',
    history: [
      { date: '2024-01-21 09:30:00', text: 'Se ha asignado personal de limpieza' }
    ],
    flagged: false
  },
  {
    codigo: "AB123C",
    fechaCreacion: "2024-01-21 09:15:00",
    estado: "En proceso",
    departamento: "Consultas externas",
    professión: "Auxiliar",
    dateTime: "2024-01-21T09:15",
    lugar: "Sala de espera",
    asunto: "Limpieza",
    descripción: "Limpieza pendiente en sala de espera",
    isConsecuent: "no",
    tipoConsecuencia: "",
    evitable: "si",
    sugerent: "Mejorar horarios de limpieza",
    archivo: [],
    flagged: false
  },
  {
    codigo: "CD456D",
    fechaCreacion: "2024-01-19 14:20:00",
    estado: "Resuelto",
    departamento: "Quirófano",
    professión: "Facultativo",
    dateTime: "2024-01-19T14:20",
    lugar: "Quirófano 2",
    asunto: "Equipamiento",
    descripción: "Revisión de equipo médico",
    isConsecuent: "si",
    tipoConsecuencia: "Prolongación de estancia",
    evitable: "si",
    sugerent: "Implementar checklist de equipos",
    archivo: [],
    flagged: false
  },
  {
    codigo: "GH012F",
    fechaCreacion: "2024-01-22 08:00:00",
    estado: "En proceso",
    departamento: "Hospitalización",
    professión: "Enfermeria",
    dateTime: "2024-01-22T08:00",
    lugar: "Planta 3",
    asunto: "Emergencia",
    descripción: "Falla en sistema eléctrico",
    isConsecuent: "si",
    tipoConsecuencia: "Precisa tratamiento",
    evitable: "si",
    sugerent: "Revisar sistema eléctrico de respaldo",
    archivo: [],
    flagged: true
  }
];

export const handlers = [
  http.get('/api/reportes', () => {
    return HttpResponse.json(mockReportes)
  }),

  http.get('/api/reportes/:codigo', ({ params }) => {
    const { codigo } = params;
    const report = mockReportes.find(r => r.codigo === codigo);
    
    if (!report) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(report);
  }),

  http.post('/api/reportes', async ({ request }) => {
    const newReport = await request.json()
    return HttpResponse.json({
      message: 'Reporte creado exitosamente',
      report: newReport
    }, { status: 201 })
  }),

  http.put('/api/reportes/:codigo/status', async ({ params, request }) => {
    const { codigo } = params
    const { status } = await request.json()
    
    const reportIndex = mockReportes.findIndex(r => r.codigo === codigo)
    if (reportIndex >= 0) {
      mockReportes[reportIndex].estado = status
      return HttpResponse.json(mockReportes[reportIndex])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.put('/api/reportes/:codigo/flag', async ({ params, request }) => {
    const { codigo } = params
    const { flagged } = await request.json()
    
    const reportIndex = mockReportes.findIndex(r => r.codigo === codigo)
    if (reportIndex >= 0) {
      mockReportes[reportIndex].flagged = flagged
      return HttpResponse.json(mockReportes[reportIndex])
    }
    return new HttpResponse(null, { status: 404 })
  })
]
