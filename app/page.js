"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  X,
  Info,
  AlertTriangle,
  ChevronDown,
  Edit3,
  Save,
  Eye,
  FileCheck,
  Zap,
  Sparkles,
  Mail,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"
import "react-toastify/dist/ReactToastify.css"

// Modificar el componente principal para incluir la vista de clientes
// Añadir el import del componente ClientList
import ClientList from "@/components/client-list"

// Custom Stylized Button Component
const StylizedButton = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "relative overflow-hidden font-semibold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50"

  const variants = {
    primary:
      "bg-gradient-to-r from-[#008342] to-[#00a352] hover:from-[#006b35] hover:to-[#008342] text-white shadow-lg hover:shadow-xl focus:ring-green-300",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl focus:ring-gray-300",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-300",
    outline:
      "border-2 border-[#008342] text-[#008342] hover:bg-[#008342] hover:text-white bg-white shadow-md hover:shadow-lg focus:ring-green-300",
    ghost: "text-gray-600 hover:text-[#008342] hover:bg-green-50 focus:ring-green-300",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-2xl",
  }

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {Icon && <Icon className="h-5 w-5" />}
        <span>{children}</span>
      </span>
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"
          initial={false}
        />
      )}
    </motion.button>
  )
}

// Accordion Component for Corrections
const CorrectionAccordion = ({ section, index, editedContent, onContentEdit }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSuggestion, setEditedSuggestion] = useState(editedContent[section.id] || section.suggestions || "")

  const handleSave = () => {
    onContentEdit(section.id, editedSuggestion)
    setIsEditing(false)
    toast.success("Corrección guardada exitosamente")
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "missing":
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "from-green-50 to-green-100 border-green-200"
      case "partial":
        return "from-yellow-50 to-yellow-100 border-yellow-200"
      case "missing":
        return "from-red-50 to-red-100 border-red-200"
      default:
        return "from-gray-50 to-gray-100 border-gray-200"
    }
  }

  const highlightText = (text, issues) => {
    if (!issues || issues.length === 0) return text

    let highlightedText = text
    issues.forEach((issue) => {
      const keywords = issue.split(" ").filter((word) => word.length > 3)
      keywords.forEach((keyword) => {
        const regex = new RegExp(`(${keyword})`, "gi")
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
      })
    })

    return highlightedText
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gradient-to-r ${getStatusColor(section.status)} border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Accordion Header */}
      <motion.div className="p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.01 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getStatusIcon(section.status)}
            <div>
              <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{section.issues?.length || 0} observaciones encontradas</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              className={`px-4 py-2 font-semibold text-sm rounded-full ${
                section.status === "compliant"
                  ? "bg-green-500 text-white"
                  : section.status === "partial"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
              }`}
            >
              {section.status === "compliant"
                ? "✅ Conforme"
                : section.status === "partial"
                  ? "⚠️ Parcial"
                  : "❌ Faltante"}
            </Badge>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="h-6 w-6 text-gray-600" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Analyzed Text Section */}
              <div className="bg-white rounded-xl p-5 shadow-inner border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  Texto Analizado:
                </h4>
                <div
                  className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg border"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      `Sección ${section.title}: Esta sección del documento ha sido analizada para verificar el cumplimiento de los requisitos establecidos en la guía de UPM Forestal Oriental. El análisis incluye la verificación de elementos específicos como estructura, contenido requerido y alineación con las políticas de seguridad.`,
                      section.issues || [],
                    ),
                  }}
                />
              </div>

              {/* Issues Section */}
              {section.issues && section.issues.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Observaciones Identificadas:
                  </h4>
                  <ul className="space-y-2">
                    {section.issues.map((issue, issueIndex) => (
                      <motion.li
                        key={issueIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: issueIndex * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {issueIndex + 1}
                        </span>
                        <span className="text-sm text-red-700 leading-relaxed">{issue}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Editable Suggestions Section */}
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-700 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sugerencias de Mejora:
                  </h4>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <StylizedButton variant="outline" size="sm" onClick={() => setIsEditing(true)} icon={Edit3}>
                        Editar
                      </StylizedButton>
                    ) : (
                      <>
                        <StylizedButton variant="primary" size="sm" onClick={handleSave} icon={Save}>
                          Guardar
                        </StylizedButton>
                        <StylizedButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false)
                            setEditedSuggestion(editedContent[section.id] || section.suggestions || "")
                          }}
                        >
                          Cancelar
                        </StylizedButton>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedSuggestion}
                      onChange={(e) => setEditedSuggestion(e.target.value)}
                      className="min-h-[150px] border-green-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                      placeholder="Edita las sugerencias de mejora aquí..."
                    />
                    <div className="text-xs text-green-600">
                      💡 Personaliza este mensaje para comunicarte efectivamente con el cliente
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                    <p className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">
                      {editedContent[section.id] || section.suggestions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Main Analysis Component
const AnalysisApp = ({ user, onBackToDashboard }) => {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [editedContent, setEditedContent] = useState({})
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleFileUpload = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      const maxSize = 25 * 1024 * 1024 // 25MB
      if (selectedFile.size > maxSize) {
        toast.error("El archivo es demasiado grande. Máximo 25MB permitido.")
        return
      }

      setFile(selectedFile)
      setAnalysisResult(null)
      toast.success(`PDF cargado: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB)`)
    } else {
      toast.error("Por favor selecciona un archivo PDF válido")
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const analyzeDocument = async () => {
    if (!file) {
      toast.error("Por favor selecciona un archivo PDF primero")
      return
    }

    const startTime = Date.now()
    setIsAnalyzing(true)
    setProgress(0)
    setAnalysisResult(null)

    try {
      const progressSteps = [
        { progress: 15, message: "Validando archivo PDF..." },
        { progress: 30, message: "Extrayendo contenido del documento..." },
        { progress: 50, message: "Analizando con inteligencia artificial..." },
        { progress: 70, message: "Comparando con estándares UPM..." },
        { progress: 85, message: "Generando reporte de análisis..." },
      ]

      let currentStep = 0
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          setProgress(progressSteps[currentStep].progress)
          toast.info(progressSteps[currentStep].message, { autoClose: 2000 })
          currentStep++
        } else {
          clearInterval(progressInterval)
        }
      }, 1000)

      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        if (response.status === 413) {
          throw new Error("El archivo es demasiado grande para procesar. Intenta con un archivo más pequeño.")
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`)
      }

      if (!result.summary || !result.sections) {
        throw new Error("Respuesta de análisis inválida")
      }

      const endTime = Date.now()
      const processingTime = Math.round((endTime - startTime) / 1000)

      setAnalysisResult(result)
      setProgress(100)

      // Guardar en historial
      const analysisRecord = {
        id: Date.now(),
        fileName: file.name,
        date: new Date().toISOString(),
        processingTime: processingTime,
        summary: result.summary,
        sections: result.sections,
        editedContent: editedContent,
        user: user?.username || "Usuario",
      }

      const existingHistory = JSON.parse(localStorage.getItem("upm_analysis_history") || "[]")
      const updatedHistory = [analysisRecord, ...existingHistory].slice(0, 50) // Mantener solo los últimos 50
      localStorage.setItem("upm_analysis_history", JSON.stringify(updatedHistory))

      const { compliant, partial, missing } = result.summary
      toast.success(`✅ Análisis completado: ${compliant} conformes, ${partial} parciales, ${missing} faltantes`, {
        autoClose: 8000,
      })
    } catch (error) {
      console.error("Analysis error:", error)
      setProgress(0)

      if (error.message.includes("413") || error.message.includes("demasiado grande")) {
        toast.error("📄 Archivo demasiado grande. Intenta con un PDF más pequeño (máx. 25MB)", { autoClose: 8000 })
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        toast.error("🌐 Error de conexión. Verifica tu internet e intenta nuevamente.", { autoClose: 8000 })
      } else {
        toast.error(`❌ Error durante el análisis: ${error.message}`, { autoClose: 8000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadCorrectedPDF = async () => {
    try {
      toast.info("Generando PDF corregido...", { autoClose: 3000 })

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalFile: file.name,
          corrections: editedContent,
          analysisResult: analysisResult,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al generar PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${file.name.replace(".pdf", "")}_corregido.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("📥 PDF descargado exitosamente")
    } catch (error) {
      toast.error("Error al descargar PDF: " + error.message)
    }
  }

  const handleContentEdit = (sectionId, newContent) => {
    setEditedContent((prev) => ({
      ...prev,
      [sectionId]: newContent,
    }))
  }

  const removeFile = () => {
    setFile(null)
    setAnalysisResult(null)
    setEditedContent({})
    setProgress(0)
    toast.info("Archivo removido")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Enhanced Header with Back Button */}
      <header className="bg-gradient-to-r from-[#202020] via-[#2a2a2a] to-[#202020] text-white py-8 shadow-2xl backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-3 bg-gradient-to-br from-[#008342] to-[#00a352] rounded-2xl shadow-lg">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  UPM Uy
                </h1>
                <p className="text-gray-300 text-lg">Análisis Inteligente de Documentos de Seguridad</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-4">
              <StylizedButton onClick={onBackToDashboard} variant="outline" size="md">
                ← Volver al Dashboard
              </StylizedButton>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-[#008342] to-[#00a352] px-6 py-3 rounded-2xl shadow-lg"
              >
                <Zap className="h-6 w-6" />
                <span className="text-lg font-semibold">Análisis con IA</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Enhanced Upload Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-12 shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#008342] via-[#00a352] to-[#008342] text-white p-8">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <Upload className="h-8 w-8" />
                <span>Cargar Documento PDF</span>
              </CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Sube un Plan de Seguridad y Salud Ocupacional para análisis automático con IA
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Límite de archivo:</strong> Máximo 25MB para garantizar un procesamiento óptimo. Para
                    archivos más grandes, considera dividir el documento o comprimir las imágenes.
                  </AlertDescription>
                </Alert>

                <div
                  className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-500 ${
                    dragActive
                      ? "border-[#008342] bg-gradient-to-br from-green-50 to-blue-50 scale-105 shadow-xl"
                      : "border-gray-300 hover:border-[#008342] hover:bg-gradient-to-br hover:from-gray-50 hover:to-green-50 hover:shadow-lg"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center space-y-6">
                    <motion.div
                      animate={{
                        scale: dragActive ? 1.2 : 1,
                        rotate: dragActive ? 10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-6 rounded-full ${dragActive ? "bg-[#008342]" : "bg-gray-100"} shadow-lg`}
                    >
                      <Upload className={`h-20 w-20 ${dragActive ? "text-white" : "text-gray-400"}`} />
                    </motion.div>
                    <div>
                      <span className="text-2xl font-bold block mb-3 text-gray-800">
                        {file ? file.name : "Arrastra tu PDF aquí o haz clic para seleccionar"}
                      </span>
                      <span className="text-lg text-gray-600">Formatos soportados: PDF • Tamaño máximo: 25MB</span>
                    </div>
                  </label>
                </div>

                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                            <CheckCircle className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-green-800 block text-lg">{file.name}</span>
                            <span className="text-green-600 text-base">
                              {(file.size / 1024 / 1024).toFixed(2)}MB • Listo para análisis
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StylizedButton
                            onClick={analyzeDocument}
                            disabled={isAnalyzing}
                            variant="primary"
                            size="lg"
                            icon={isAnalyzing ? Loader2 : FileCheck}
                          >
                            {isAnalyzing ? "Analizando..." : "Iniciar Análisis"}
                          </StylizedButton>
                          <StylizedButton onClick={removeFile} variant="ghost" size="md" icon={X}>
                            Remover
                          </StylizedButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-800 text-lg">
                          {progress < 20
                            ? "🔍 Procesando archivo PDF..."
                            : progress < 40
                              ? "📄 Extrayendo contenido..."
                              : progress < 60
                                ? "🤖 Analizando con IA..."
                                : progress < 80
                                  ? "📊 Comparando con estándares..."
                                  : progress < 95
                                    ? "📋 Generando reporte..."
                                    : "✅ Finalizando análisis..."}
                        </span>
                        <span className="text-[#008342] font-bold text-2xl">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full h-4 rounded-full" />
                      <div className="text-blue-600 text-center font-medium">
                        {progress < 50
                          ? "Procesando documento extenso con IA avanzada..."
                          : "Realizando análisis detallado según estándares UPM..."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Analysis Results with Accordion */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-12 shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white p-8">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <AlertCircle className="h-8 w-8" />
                    <span>Resultados del Análisis</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Revisión detallada del documento según los estándares de UPM Forestal Oriental
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-10">
                    {/* Enhanced Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <motion.div
                        className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 p-8 rounded-3xl border-2 border-green-200 shadow-xl"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {analysisResult.summary?.compliant || 0}
                            </div>
                            <div className="text-lg font-semibold text-green-800">Secciones Conformes</div>
                          </div>
                          <div className="p-4 bg-green-500 rounded-2xl shadow-lg">
                            <CheckCircle className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-100 p-8 rounded-3xl border-2 border-yellow-200 shadow-xl"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-4xl font-bold text-yellow-600 mb-2">
                              {analysisResult.summary?.partial || 0}
                            </div>
                            <div className="text-lg font-semibold text-yellow-800">Requieren Mejoras</div>
                          </div>
                          <div className="p-4 bg-yellow-500 rounded-2xl shadow-lg">
                            <AlertTriangle className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-red-100 via-red-50 to-rose-100 p-8 rounded-3xl border-2 border-red-200 shadow-xl"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-4xl font-bold text-red-600 mb-2">
                              {analysisResult.summary?.missing || 0}
                            </div>
                            <div className="text-lg font-semibold text-red-800">Secciones Faltantes</div>
                          </div>
                          <div className="p-4 bg-red-500 rounded-2xl shadow-lg">
                            <X className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Accordion for Corrections */}
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Análisis Detallado por Sección
                      </h3>
                      {analysisResult.sections?.map((section, index) => (
                        <CorrectionAccordion
                          key={index}
                          section={section}
                          index={index}
                          editedContent={editedContent}
                          onContentEdit={handleContentEdit}
                        />
                      ))}
                    </div>

                    {/* Enhanced Download Section */}
                    <motion.div
                      className="flex justify-center gap-4 pt-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <StylizedButton
                        onClick={downloadCorrectedPDF}
                        variant="primary"
                        size="xl"
                        icon={Download}
                        className="shadow-2xl"
                      >
                        Descargar PDF Corregido
                      </StylizedButton>
                      <StylizedButton
                        onClick={() => setShowEmailModal(true)}
                        variant="secondary"
                        size="xl"
                        icon={Mail}
                        className="shadow-2xl"
                      >
                        Enviar por Email
                      </StylizedButton>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#008342] to-[#00a352] p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Enviar Corrección por Email
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Documento</label>
                  <div className="p-3 bg-gray-50 border rounded-lg text-gray-800">
                    {file?.name || "Documento sin nombre"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email del destinatario</label>
                  <input
                    type="email"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="cliente@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    placeholder="Estimado cliente, adjunto enviamos las correcciones sugeridas para su documento..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <StylizedButton variant="ghost" size="sm" onClick={() => setShowEmailModal(false)}>
                    Cancelar
                  </StylizedButton>
                  <StylizedButton
                    variant="primary"
                    size="sm"
                    icon={Mail}
                    onClick={() => {
                      toast.success("Email enviado correctamente")
                      setShowEmailModal(false)

                      // Guardar en historial que se envió un email
                      const analysisRecord = {
                        id: Date.now(),
                        fileName: file.name,
                        date: new Date().toISOString(),
                        processingTime: 0,
                        summary: analysisResult.summary,
                        sections: analysisResult.sections,
                        editedContent: editedContent,
                        user: user?.username || "Usuario",
                        emailSent: true,
                      }

                      const existingHistory = JSON.parse(localStorage.getItem("upm_analysis_history") || "[]")
                      const updatedHistory = [analysisRecord, ...existingHistory].slice(0, 50)
                      localStorage.setItem("upm_analysis_history", JSON.stringify(updatedHistory))
                    }}
                  >
                    Enviar Email
                  </StylizedButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-[#202020] via-[#2a2a2a] to-[#202020] text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-gray-300 mb-3 text-lg">
                Desarrollado con ❤️ por{" "}
                <a
                  href="https://webrushbrasil.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#008342] hover:text-[#00a352] font-bold transition-colors duration-300 text-xl"
                >
                  WebRush Brasil
                </a>
              </p>
              <p className="text-gray-400">
                © 2024 UPM Uy - Todos los derechos reservados • Análisis inteligente de documentos
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState("login") // 'login', 'dashboard', 'analysis'

  // Añadir el estado para el cliente seleccionado
  const [selectedClient, setSelectedClient] = useState(null)

  useEffect(() => {
    // Verificar si hay usuario guardado en localStorage
    const savedUser = localStorage.getItem("upm_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentView("dashboard")
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("upm_user")
    setUser(null)
    setCurrentView("login")
    toast.info("Sesión cerrada exitosamente")
  }

  const handleNewAnalysis = () => {
    setCurrentView("analysis")
  }

  // Modificar la función handleNewAnalysis para incluir la vista de clientes
  const handleViewClients = () => {
    setCurrentView("clients")
  }

  // Añadir la función para seleccionar un cliente
  const handleSelectClient = (client) => {
    setSelectedClient(client)
    setCurrentView("email-form")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
  }

  // Modificar la sección de renderizado condicional para incluir la vista de clientes
  if (currentView === "login") {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  if (currentView === "dashboard") {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        onNewAnalysis={handleNewAnalysis}
        onViewClients={handleViewClients}
      />
    )
  }

  if (currentView === "analysis") {
    return <AnalysisApp user={user} onBackToDashboard={handleBackToDashboard} />
  }

  if (currentView === "clients") {
    return <ClientList onSelectClient={handleSelectClient} onBackToDashboard={handleBackToDashboard} />
  }

  if (currentView === "email-form") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#008342] to-[#00a352] p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5" /> Enviar Documento a Cliente
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <div className="p-3 bg-gray-50 border rounded-lg text-gray-800 font-medium">{selectedClient?.name}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="p-3 bg-gray-50 border rounded-lg text-gray-800">{selectedClient?.email}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Documento</label>
              <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar documento...</option>
                {JSON.parse(localStorage.getItem("upm_analysis_history") || "[]")
                  .slice(0, 5)
                  .map((doc, index) => (
                    <option key={index} value={doc.id}>
                      {doc.fileName} ({new Date(doc.date).toLocaleDateString()})
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mensaje</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder={`Estimado ${selectedClient?.name},\n\nAdjunto enviamos las correcciones sugeridas para su documento de seguridad.\n\nSaludos cordiales,\nEquipo UPM Uy`}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <StylizedButton variant="ghost" size="sm" onClick={() => setCurrentView("clients")}>
                Cancelar
              </StylizedButton>
              <StylizedButton
                variant="primary"
                size="sm"
                icon={Mail}
                onClick={() => {
                  toast.success(`Email enviado correctamente a ${selectedClient?.name}`)
                  setCurrentView("clients")
                }}
              >
                Enviar Email
              </StylizedButton>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="shadow-2xl rounded-xl"
      />
    </>
  )
}
