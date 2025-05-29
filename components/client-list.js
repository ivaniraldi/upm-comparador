"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Search, UserPlus, Mail, Phone, Building, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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

// Datos de ejemplo para clientes
const sampleClients = [
  {
    id: 1,
    name: "Constructora Forestal ABC S.A.",
    email: "contacto@forestalabc.com",
    phone: "+598 9876 5432",
    address: "Ruta 5, Km 432, Tacuarembó",
    documents: 3,
  },
  {
    id: 2,
    name: "Maderas del Este Ltda.",
    email: "info@maderasdeleste.com.uy",
    phone: "+598 9123 4567",
    address: "Av. Italia 1234, Montevideo",
    documents: 1,
  },
  {
    id: 3,
    name: "Aserradero Norte S.R.L.",
    email: "ventas@aserraderonorte.com",
    phone: "+598 9345 6789",
    address: "Camino Maldonado 567, Rivera",
    documents: 5,
  },
  {
    id: 4,
    name: "Forestación Uruguaya S.A.",
    email: "contacto@forestacionuy.com",
    phone: "+598 9234 5678",
    address: "Ruta 7, Km 123, Cerro Largo",
    documents: 2,
  },
  {
    id: 5,
    name: "Celulosa del Río S.A.",
    email: "info@celulosadelrio.com.uy",
    phone: "+598 9456 7890",
    address: "Ruta 2, Km 302, Fray Bentos",
    documents: 4,
  },
]

export default function ClientList({ onSelectClient, onBackToDashboard }) {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    // Cargar clientes desde localStorage o usar datos de ejemplo
    const savedClients = localStorage.getItem("upm_clients")
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients))
      } catch (error) {
        console.error("Error parsing clients:", error)
        setClients(sampleClients)
      }
    } else {
      setClients(sampleClients)
      localStorage.setItem("upm_clients", JSON.stringify(sampleClients))
    }
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      return
    }

    const newClientWithId = {
      ...newClient,
      id: Date.now(),
      documents: 0,
    }

    const updatedClients = [...clients, newClientWithId]
    setClients(updatedClients)
    localStorage.setItem("upm_clients", JSON.stringify(updatedClients))
    setShowAddClientModal(false)
    setNewClient({
      name: "",
      email: "",
      phone: "",
      address: "",
    })
  }

  const handleDeleteClient = (id) => {
    const updatedClients = clients.filter((client) => client.id !== id)
    setClients(updatedClients)
    localStorage.setItem("upm_clients", JSON.stringify(updatedClients))
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
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Clientes UPM Uy</h1>
                <p className="text-gray-300">Gestión de Clientes y Documentos</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <StylizedButton onClick={onBackToDashboard} variant="outline" size="md">
                ← Volver al Dashboard
              </StylizedButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Users className="h-7 w-7" />
                  <span>Directorio de Clientes</span>
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Gestiona tus clientes y envía documentos corregidos
                </CardDescription>
              </div>
              <StylizedButton onClick={() => setShowAddClientModal(true)} variant="primary" size="md" icon={UserPlus}>
                Nuevo Cliente
              </StylizedButton>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar clientes por nombre o email..."
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Client List */}
              <div className="space-y-4">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron clientes</h3>
                    <p className="text-gray-500">Intenta con otra búsqueda o agrega un nuevo cliente</p>
                  </div>
                ) : (
                  filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl text-gray-800">{client.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-blue-500" />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-green-500" />
                              <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-purple-500" />
                              <span>{client.address}</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                              {client.documents} documentos
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StylizedButton
                            variant="primary"
                            size="sm"
                            icon={Mail}
                            onClick={() => onSelectClient(client)}
                          >
                            Enviar Documento
                          </StylizedButton>
                          <StylizedButton
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            Eliminar
                          </StylizedButton>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5" /> Agregar Nuevo Cliente
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la empresa"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@empresa.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+598 9123 4567"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección de la empresa"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <StylizedButton variant="ghost" size="sm" onClick={() => setShowAddClientModal(false)}>
                  Cancelar
                </StylizedButton>
                <StylizedButton variant="primary" size="sm" icon={UserPlus} onClick={handleAddClient}>
                  Agregar Cliente
                </StylizedButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
