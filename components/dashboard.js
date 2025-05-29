"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Calendar,
  Clock,
  Trash2,
  Eye,
  BarChart3,
  User,
  LogOut,
  Upload,
  History,
  CheckCircle,
  AlertTriangle,
  X,
  Mail,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"

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

export default function Dashboard({ user, onLogout, onNewAnalysis, onViewClients }) {
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [currentView, setCurrentView] = useState("dashboard") // 'dashboard' or 'new-analysis' or 'clients'
  const [showEmailModal, setShowEmailModal] = useState({ show: false, analysis: null })

  useEffect(() => {
    // Cargar historial desde localStorage
    const savedHistory = localStorage.getItem("upm_analysis_history")
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error parsing analysis history:", error)
        setAnalysisHistory([])
      }
    }
  }, [])

  const deleteAnalysis = (id) => {
    const updatedHistory = analysisHistory.filter((item) => item.id !== id)
    setAnalysisHistory(updatedHistory)
    localStorage.setItem("upm_analysis_history", JSON.stringify(updatedHistory))
  }

  const clearAllHistory = () => {
    setAnalysisHistory([])
    localStorage.removeItem("upm_analysis_history")
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "missing":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "missing":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateStats = () => {
    if (analysisHistory.length === 0) return { total: 0, compliant: 0, partial: 0, missing: 0 }

    const stats = analysisHistory.reduce(
      (acc, analysis) => {
        acc.total += 1
        acc.compliant += analysis.summary?.compliant || 0
        acc.partial += analysis.summary?.partial || 0
        acc.missing += analysis.summary?.missing || 0
        return acc
      },
      { total: 0, compliant: 0, partial: 0, missing: 0 },
    )

    return stats
  }

  const stats = calculateStats()

  if (currentView === "new-analysis") {
    return onNewAnalysis()
  }

  if (currentView === "clients") {
    return onViewClients()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#202020] via-[#2a2a2a] to-[#202020] text-white py-6 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-3 bg-gradient-to-br from-[#008342] to-[#00a352] rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard UPM Uy</h1>
                <p className="text-gray-300">Gestión de Análisis de Documentos</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl">
                <User className="h-5 w-5" />
                <span className="font-semibold">{user?.name || user?.username}</span>
              </div>
              <StylizedButton onClick={onLogout} variant="secondary" size="md" icon={LogOut}>
                Cerrar Sesión
              </StylizedButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <StylizedButton
            onClick={() => setCurrentView("dashboard")}
            variant={currentView === "dashboard" ? "primary" : "outline"}
            icon={BarChart3}
          >
            Dashboard
          </StylizedButton>
          <StylizedButton
            onClick={() => setCurrentView("new-analysis")}
            variant={currentView === "new-analysis" ? "primary" : "outline"}
            icon={Upload}
          >
            Nuevo Análisis
          </StylizedButton>
          <StylizedButton
            onClick={() => setCurrentView("clients")}
            variant={currentView === "clients" ? "primary" : "outline"}
            icon={Users}
          >
            Clientes
          </StylizedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold">Total Análisis</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
                  </div>
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-semibold">Conformes</p>
                    <p className="text-3xl font-bold text-green-800">{stats.compliant}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 font-semibold">Parciales</p>
                    <p className="text-3xl font-bold text-yellow-800">{stats.partial}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 font-semibold">Faltantes</p>
                    <p className="text-3xl font-bold text-red-800">{stats.missing}</p>
                  </div>
                  <X className="h-10 w-10 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* History Section */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <History className="h-7 w-7" />
                  <span>Historial de Análisis</span>
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Registro completo de todos los documentos analizados
                </CardDescription>
              </div>
              {analysisHistory.length > 0 && (
                <StylizedButton onClick={clearAllHistory} variant="danger" size="sm" icon={Trash2}>
                  Limpiar Todo
                </StylizedButton>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {analysisHistory.length === 0 ? (
              <div className="text-center py-12">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                  <FileText className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay análisis realizados</h3>
                  <p className="text-gray-500 mb-6">Comienza subiendo tu primer documento PDF para análisis</p>
                  <StylizedButton
                    onClick={() => setCurrentView("new-analysis")}
                    variant="primary"
                    size="lg"
                    icon={Upload}
                  >
                    Realizar Primer Análisis
                  </StylizedButton>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {analysisHistory.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 mb-1">{analysis.fileName}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(analysis.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{analysis.processingTime}s</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 mt-3">
                              <Badge className="bg-green-100 text-green-800 border border-green-200">
                                ✅ {analysis.summary?.compliant || 0} Conformes
                              </Badge>
                              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                                ⚠️ {analysis.summary?.partial || 0} Parciales
                              </Badge>
                              <Badge className="bg-red-100 text-red-800 border border-red-200">
                                ❌ {analysis.summary?.missing || 0} Faltantes
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <StylizedButton
                            variant="outline"
                            size="sm"
                            icon={Eye}
                            onClick={() => {
                              // Aquí podrías implementar una vista detallada
                              console.log("Ver detalles:", analysis)
                            }}
                          >
                            Ver
                          </StylizedButton>
                          <StylizedButton
                            variant="primary"
                            size="sm"
                            icon={Mail}
                            onClick={() => setShowEmailModal({ show: true, analysis })}
                          >
                            Enviar
                          </StylizedButton>
                          <StylizedButton
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => deleteAnalysis(analysis.id)}
                          >
                            Eliminar
                          </StylizedButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {showEmailModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5" /> Enviar Corrección por Email
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Documento</label>
                <div className="p-3 bg-gray-50 border rounded-lg text-gray-800">
                  {showEmailModal.analysis?.fileName || "Documento sin nombre"}
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
                <StylizedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailModal({ show: false, analysis: null })}
                >
                  Cancelar
                </StylizedButton>
                <StylizedButton
                  variant="primary"
                  size="sm"
                  icon={Mail}
                  onClick={() => {
                    toast.success("Email enviado correctamente")
                    setShowEmailModal({ show: false, analysis: null })
                  }}
                >
                  Enviar Email
                </StylizedButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
