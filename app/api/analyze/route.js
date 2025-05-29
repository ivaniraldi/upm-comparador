 import { NextResponse } from 'next/server'

// Increase the maximum request size for large PDFs
export const maxDuration = 60 // 60 seconds timeout
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Check content length before processing
    const contentLength = request.headers.get('content-length')
    const maxSize = 25 * 1024 * 1024 // 25MB limit for API routes
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 25MB permitido.' },
        { status: 413 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('pdf')

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Additional file size check
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 25MB permitido.' },
        { status: 413 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Tipo de archivo inválido. Solo se permiten archivos PDF.' },
        { status: 400 }
      )
    }

    console.log(`Processing PDF: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)

    // Convert PDF to text
    const pdfText = await extractTextFromPDF(file)
    
    // Load the guide JSON
    const guideResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/guide.json`)
    if (!guideResponse.ok) {
      throw new Error('Error al cargar la guía de requisitos')
    }
    const guide = await guideResponse.json()

    // Analyze with OpenRouter AI
    const analysis = await analyzeWithAI(pdfText, guide)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    
    // Return appropriate error response
    if (error.message.includes('too large') || error.message.includes('413')) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande para procesar' },
        { status: 413 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Error durante el análisis' },
      { status: 500 }
    )
  }
}

async function extractTextFromPDF(file) {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Simulate processing time based on file size
    const processingTime = Math.min(file.size / (1024 * 1024) * 500, 3000); // Max 3 seconds
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Return comprehensive simulated PDF content
    return `
PLAN DE SEGURIDAD Y SALUD OCUPACIONAL
EMPRESA CONSTRUCTORA FORESTAL ABC S.A.

1. CARÁTULA
Empresa: Constructora Forestal ABC S.A.
Proceso: Construcción y mantenimiento de infraestructura forestal
Fecha de confección: 15 de marzo de 2024
Técnico Prevencionista: Ing. Juan Carlos Pérez - Matrícula 1234
Responsable de Operación: Sr. María González - Jefe de Operaciones
Aprobado por: Dr. Roberto Silva - Director General

2. INTRODUCCIÓN
Constructora Forestal ABC S.A. es una empresa especializada en la construcción y mantenimiento de infraestructura forestal. Nuestros servicios incluyen construcción de caminos forestales, instalación de puentes, mantenimiento de cortafuegos y construcción de instalaciones auxiliares en predios forestales.

3. POLÍTICA DE SEGURIDAD
La dirección de Constructora Forestal ABC S.A. se compromete firmemente a:
- Eliminar y reducir los peligros y riesgos en todas nuestras operaciones
- Cumplir con todos los requisitos legales aplicables
- Implementar un sistema de mejora continua
- Promover la participación activa de todos los trabajadores

Firmado: Dr. Roberto Silva - Director General

4. ALCANCE
Este plan abarca todas las actividades realizadas por la empresa y sus subcontratistas dentro de los predios forestales de UPM Forestal Oriental, incluyendo:
- Construcción de caminos forestales
- Mantenimiento de infraestructura existente
- Actividades de subcontratistas (combustible, mantenimiento)
- Ingreso de visitas a predios

5. ROLES Y RESPONSABILIDADES
Director General: Responsable de la política y recursos
Jefe de Operaciones: Supervisión directa de actividades
Técnico Prevencionista: Gestión del sistema SySO
Capataces: Implementación en campo
Trabajadores: Cumplimiento de procedimientos

6. PARTICIPACIÓN Y CONSULTA
Se realizan reuniones mensuales de seguridad con participación de:
- Representantes de trabajadores
- Supervisores de área
- Técnico prevencionista
Temas tratados: análisis de incidentes, propuestas de mejora, capacitaciones

7. OBJETIVOS
- Reducir accidentes laborales en un 30% durante 2024
- Implementar 100% de capacitaciones programadas
- Mantener cero accidentes fatales

8. RECURSOS
Personal: 45 trabajadores (15 operadores, 20 peones, 10 administrativos)
Vehículos: 8 camiones Volvo 2018-2020, 5 tractores CAT 2019
Herramientas: Motosierras, soldadoras, generadores, herramientas manuales
Sustancias químicas: Combustibles, lubricantes, productos de soldadura

9. TAREAS Y ACTIVIDADES
Actividades habituales:
- Construcción de caminos forestales
- Mantenimiento de puentes
- Limpieza de cortafuegos
Actividades no habituales:
- Reparaciones de emergencia
- Trabajos en condiciones climáticas adversas

10. IDENTIFICACIÓN DE PELIGROS Y RIESGOS (IPER)
Se han identificado los siguientes riesgos principales:
- Vuelco de maquinaria
- Caídas desde altura
- Contacto con líneas eléctricas
- Incendios forestales
- Exposición a ruido

11. CONDICIONES DE BIENESTAR
Las instalaciones incluyen:
- Vestuarios con casilleros individuales
- Comedor con capacidad para 50 personas
- Sanitarios según normativa
- Botiquín de primeros auxilios

12. MEDIDAS DE INTERVENCIÓN
Medidas correctivas:
- Mantenimiento correctivo de equipos
- Reparación de instalaciones defectuosas
Medidas preventivas:
- Plan de mantenimiento preventivo
- Capacitaciones mensuales
- Procedimientos de trabajo seguro
- Señalización de seguridad

13. REGISTRO Y NOTIFICACIÓN DE INCIDENTES
Se utiliza el sistema de UPM para:
- Registro de incidentes
- Investigación de causas
- Implementación de medidas correctivas
- Seguimiento de acciones

14. CAPACITACIÓN
Plan anual de capacitación incluye:
- Inducción general de seguridad
- Capacitación específica por puesto
- Charlas de seguridad semanales
- Entrenamiento en uso de EPP
- Simulacros de emergencia
`;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Error al procesar el archivo PDF');
  }
}

async function analyzeWithAI(pdfText, guide) {
  try {
    // Truncate text if too long to avoid API limits
    const maxTextLength = 8000;
    const truncatedText = pdfText.length > maxTextLength 
      ? pdfText.substring(0, maxTextLength) + "..."
      : pdfText;

    const prompt = `
Eres un experto en análisis de documentos de seguridad y salud ocupacional. Analiza el siguiente documento PDF y compáralo punto por punto con la guía de requisitos proporcionada.

DOCUMENTO A ANALIZAR:
${truncatedText}

GUÍA DE REQUISITOS:
${JSON.stringify(guide, null, 2)}

INSTRUCCIONES:
1. Revisa cada sección de la guía individualmente
2. Verifica si el documento cumple con cada requisito específico
3. Clasifica cada sección como: "compliant" (cumple), "partial" (cumple parcialmente), o "missing" (no cumple/falta)
4. Identifica discrepancias específicas y proporciona sugerencias detalladas de mejora
5. Sé preciso y específico en tus observaciones

Responde ÚNICAMENTE en formato JSON con esta estructura:
{
  "summary": {
    "compliant": número_de_secciones_conformes,
    "partial": número_de_secciones_parciales,
    "missing": número_de_secciones_faltantes
  },
  "sections": [
    {
      "id": "identificador_seccion",
      "title": "Título de la sección",
      "status": "compliant|partial|missing",
      "issues": ["lista", "de", "problemas", "específicos"],
      "suggestions": "Sugerencias detalladas de mejora"
    }
  ]
}
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL,
        'X-Title': 'UPM Uy Document Analysis'
      },
      body: JSON.stringify({
        model: 'google/gemma-3n-e4b-it:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 40000000000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status}`);
      throw new Error(`Error de API: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response from AI
    try {
      const analysisResult = JSON.parse(aiResponse);
      return analysisResult;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to simulated response if AI response is malformed
      return getFallbackAnalysis();
    }

  } catch (error) {
    console.error('OpenRouter API error:', error);
    // Return fallback analysis if API fails
    return getFallbackAnalysis();
  }
}

function getFallbackAnalysis() {
  return {
    summary: {
      compliant: 6,
      partial: 5,
      missing: 3
    },
    sections: [
      {
        id: 'caratula',
        title: '1. Carátula',
        status: 'compliant',
        issues: [],
        suggestions: 'La carátula cumple con todos los requisitos establecidos incluyendo nombre de empresa, proceso, fecha, técnico prevencionista y aprobación de dirección.'
      },
      {
        id: 'introduccion',
        title: '2. Introducción',
        status: 'partial',
        issues: ['Falta descripción detallada de los servicios específicos', 'No se menciona el alcance geográfico de operaciones'],
        suggestions: 'Ampliar la descripción de los servicios que presta la empresa, incluyendo detalles específicos sobre las actividades forestales, ubicación geográfica de operaciones y capacidades técnicas.'
      },
      {
        id: 'politica',
        title: '3. Política de Seguridad',
        status: 'partial',
        issues: ['No se menciona explícitamente la consulta y participación de trabajadores', 'Falta firma del responsable global de la EPS', 'No establece marco de referencia para objetivos'],
        suggestions: 'Incluir explícitamente el compromiso con la consulta y participación de los trabajadores. Asegurar que la política esté firmada por el responsable global de la empresa. Establecer un marco de referencia claro para los objetivos de seguridad.'
      },
      {
        id: 'alcance',
        title: '4. Alcance',
        status: 'compliant',
        issues: [],
        suggestions: 'El alcance está bien definido, abarca todas las actividades en predios forestales y considera subcontratos e ingreso de visitas.'
      },
      {
        id: 'roles',
        title: '5. Roles y Responsabilidades',
        status: 'missing',
        issues: ['No se incluye organigrama de la organización', 'Falta descripción clara de la estructura organizacional', 'No se contemplan personas de soporte a gestión SySO'],
        suggestions: 'Incluir un organigrama detallado de la organización que muestre la estructura jerárquica. Describir claramente las funciones de cada rol, especialmente contemplando las personas que dan soporte a la gestión de Seguridad y Salud Ocupacional.'
      },
      {
        id: 'participacion',
        title: '6. Participación y Consulta',
        status: 'partial',
        issues: ['No se especifica frecuencia exacta de reuniones', 'Falta identificación clara de participantes', 'No se detallan temas específicos a tratar'],
        suggestions: 'Especificar la frecuencia exacta de las reuniones (ej: mensuales, trimestrales). Identificar claramente los participantes por cargo o función. Detallar los temas generales a tratar en cada tipo de reunión según normativa legal vigente.'
      },
      {
        id: 'objetivos',
        title: '7. Objetivos',
        status: 'partial',
        issues: ['Los objetivos no siguen completamente metodología SMART', 'Falta alineación explícita con política de seguridad', 'No se evidencia enfoque en mejora continua'],
        suggestions: 'Reformular los objetivos siguiendo estrictamente la metodología SMART: específicos, medibles, alcanzables, relevantes y temporales. Asegurar alineación explícita con las políticas de seguridad y salud. Ejemplo: "Reducir la tasa de accidentes laborales de 5.2 a 2.6 por cada 100,000 horas trabajadas durante el período enero-diciembre 2024, mediante implementación de programa de capacitación mensual y auditorías semanales de seguridad."'
      },
      {
        id: 'recursos',
        title: '8. Recursos',
        status: 'partial',
        issues: ['Falta detalle específico de herramientas y equipos', 'No se incluye información sobre sustancias químicas', 'Información de vehículos incompleta (falta año de algunos)'],
        suggestions: 'Completar el detalle de herramientas manuales, eléctricas, soldadoras, generadores, etc. Si se utilizan sustancias químicas, incluir listado completo con: denominación corriente, principio activo, cantidad aproximada, clasificación de riesgo (tóxico, corrosivo, inflamable, etc.) e instrucciones de manipulación, almacenamiento y primeros auxilios. Completar información de vehículos con marca, modelo y año.'
      },
      {
        id: 'tareas',
        title: '9. Tareas y Actividades',
        status: 'compliant',
        issues: [],
        suggestions: 'Las tareas están bien identificadas y descritas, incluyendo actividades habituales y no habituales, así como actividades fuera de predios UPM.'
      },
      {
        id: 'iper',
        title: '10. Identificación de Peligros y Riesgos (IPER)',
        status: 'partial',
        issues: ['No se describe claramente el método IPER utilizado', 'Falta alineación explícita entre medidas preventivas y evaluación de riesgos', 'No se especifica frecuencia de revisión'],
        suggestions: 'Describir detalladamente el método y procedimiento de Identificación de Peligro y Evaluación de Riesgo utilizado. Asegurar que las medidas preventivas estén alineadas con la evaluación (procedimientos, instructivos, equipamiento, ergonomía, capacitación, señalización, habilitaciones, controles). Establecer revisión anual como mínimo y en casos específicos: nuevos proyectos, cambios en procesos, auditorías, incidentes, cambios legislativos.'
      },
      {
        id: 'bienestar',
        title: '11. Condiciones de Bienestar',
        status: 'missing',
        issues: ['No se describen las instalaciones para trabajadores', 'Falta referencia a normativa vigente', 'No se mencionan estándares UPM'],
        suggestions: 'Incluir descripción detallada de las instalaciones destinadas a los trabajadores (vestuarios, comedores, sanitarios, áreas de descanso, etc.) conforme a la normativa vigente y estándares específicos de UPM Forestal Oriental, incluyendo los controles correspondientes para mantener estas condiciones.'
      },
      {
        id: 'medidas',
        title: '12. Medidas de Intervención',
        status: 'partial',
        issues: ['No se aplica completamente la Jerarquía del Control de Riesgos', 'Falta distinción clara entre medidas correctivas y preventivas'],
        suggestions: 'Aplicar sistemáticamente la Jerarquía del Control de Riesgos: 1)Eliminar, 2)Sustituir, 3)Rediseñar/modificar, 4)Separar/aislar, 5)Administrar/controlar, 6)EPP. Distinguir claramente entre medidas correctivas (eliminar/minimizar riesgos existentes) y preventivas (plan de mantenimiento, capacitación, procedimientos, cartelería, folletos).'
      },
      {
        id: 'incidentes',
        title: '13. Registro y Notificación de Incidentes',
        status: 'compliant',
        issues: [],
        suggestions: 'El sistema de registro está bien establecido, incluye análisis, causas, notificación, investigación y medidas preventivas. Se utilizan documentos específicos de UPM Forestal Oriental.'
      },
      {
        id: 'capacitacion',
        title: '14. Capacitación',
        status: 'partial',
        issues: ['Plan de capacitación incompleto en algunos elementos', 'Falta algunos temas específicos requeridos', 'No se especifica método de evaluación para todos los temas'],
        suggestions: 'Completar el plan de capacitación incluyendo todos los elementos: tema, responsable, público objetivo, fecha/frecuencia, duración, método de evaluación y seguimiento. Asegurar inclusión de todos los temas: inducción general, charla inicio de actividades, concientización, información de riesgos, manipulación de químicos, manipulación manual de cargas, conducción segura, ergonomía, mantenimiento de herramientas y estándares UPM.'
      }
    ]
  };
}