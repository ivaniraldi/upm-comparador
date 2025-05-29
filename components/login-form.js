"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Lock, LogIn, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  }

  const sizes = {
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

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo: cualquier usuario/contraseña es válido
    if (username.trim() && password.trim()) {
      const user = {
        id: 1,
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        loginTime: new Date().toISOString(),
      }

      // Guardar usuario en localStorage
      localStorage.setItem("upm_user", JSON.stringify(user))

      onLoginSuccess(user)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#008342] via-[#00a352] to-[#008342] text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 p-4 bg-white/20 rounded-2xl w-fit"
            >
              <FileText className="h-12 w-12" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">UPM Uy</CardTitle>
            <CardDescription className="text-green-100 text-lg">Análisis Inteligente de Documentos</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-gray-700 font-semibold">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-[#008342] rounded-xl"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-[#008342] rounded-xl"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <StylizedButton
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={LogIn}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </StylizedButton>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <p className="text-sm text-blue-700 text-center">
                <strong>Demo:</strong> Usa cualquier usuario y contraseña para acceder
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
