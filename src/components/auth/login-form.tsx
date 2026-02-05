"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/zod"
import * as z from "zod"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react"

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    try {
      const response = await signIn(formData)
      const result = response as { error?: string } | undefined

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Akses diberikan. Selamat datang di KostFlow!")
      }
    } catch {
      toast.error("Terjadi masalah pada koneksi server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="nama@email.com"
              type="email"
              className={`h-11 focus-visible:ring-[#D4AF37] ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs font-bold text-[#D4AF37] hover:text-[#C5A028]">
                Lupa password?
              </a>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                className={`h-11 pr-10 focus-visible:ring-[#D4AF37] ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>
          <Button
            disabled={isLoading}
            className="h-12 bg-black hover:bg-slate-900 text-[#D4AF37] font-bold shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            Masuk ke Portal Eksklusif
          </Button>
        </div>
      </form>
    </div>
  )
}