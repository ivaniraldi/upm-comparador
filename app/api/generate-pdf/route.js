import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { originalFile, corrections, analysisResult } = await request.json()

    // Generate enhanced PDF with tabular format
    const correctedPDFContent = generateEnhancedPDF(originalFile, corrections, analysisResult)

    // Convert to blob
    const blob = new Blob([correctedPDFContent], { type: "application/pdf" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${originalFile.replace(".pdf", "")}_corregido.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Error generating PDF" }, { status: 500 })
  }
}

function generateEnhancedPDF(originalFile, corrections, analysisResult) {
  // Enhanced PDF generation with proper tabular format
  const currentDate = new Date().toLocaleDateString("es-UY")

  const pdfHeader = "%PDF-1.4\n"
  const pdfContent = `
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
/F2 6 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 2500
>>
stream
BT
/F1 16 Tf
50 750 Td
(REPORTE DE ANÁLISIS DE DOCUMENTO - UPM UY) Tj
0 -30 Td
/F2 12 Tf
(Documento: ${originalFile}) Tj
0 -20 Td
(Fecha de análisis: ${currentDate}) Tj
0 -20 Td
(Generado por: Sistema de Análisis Inteligente UPM) Tj

0 -40 Td
/F1 14 Tf
(RESUMEN EJECUTIVO) Tj
0 -25 Td
/F2 10 Tf
(Secciones conformes: ${analysisResult?.summary?.compliant || 0}) Tj
0 -15 Td
(Secciones que requieren mejoras: ${analysisResult?.summary?.partial || 0}) Tj
0 -15 Td
(Secciones faltantes: ${analysisResult?.summary?.missing || 0}) Tj

0 -40 Td
/F1 14 Tf
(TABLA DE CORRECCIONES DETALLADAS) Tj
0 -25 Td

${analysisResult?.sections
  ?.map((section, index) => {
    const correctionText = corrections[section.id] || section.suggestions || "Sin correcciones específicas"
    return `
0 -20 Td
/F1 11 Tf
(${index + 1}. ${section.title}) Tj
0 -15 Td
/F2 9 Tf
(Estado: ${section.status === "compliant" ? "CONFORME" : section.status === "partial" ? "PARCIAL" : "FALTANTE"}) Tj
0 -12 Td
(Observaciones: ${section.issues?.join("; ") || "Ninguna"}) Tj
0 -12 Td
(Correcciones sugeridas:) Tj
0 -10 Td
(${correctionText.substring(0, 100)}...) Tj
0 -15 Td
(----------------------------------------) Tj`
  })
  .join("")}

0 -40 Td
/F1 12 Tf
(INSTRUCCIONES PARA EL CLIENTE:) Tj
0 -20 Td
/F2 10 Tf
(1. Revisar cada punto de corrección detallado en la tabla) Tj
0 -15 Td
(2. Implementar las mejoras sugeridas en el documento original) Tj
0 -15 Td
(3. Verificar el cumplimiento de todos los requisitos UPM) Tj
0 -15 Td
(4. Reenviar el documento corregido para nueva revisión) Tj

0 -40 Td
/F1 10 Tf
(Desarrollado por WebRush Brasil - https://webrushbrasil.com.br) Tj
0 -15 Td
(© 2024 UPM Uy - Todos los derechos reservados) Tj

ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000002900 00000 n 
0000002970 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
3040
%%EOF
`

  return pdfHeader + pdfContent
}
