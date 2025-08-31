"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "sonner";
import SpinnerCustom from "@/customalert/spinnerCustom";
import AnimatedTitle from "@/animate/animatedTitle";
import { useAuth } from "@/context/authContext";

// ✅ Esquema de validación
const schema = z
  .object({
    email: z.string().email({ message: "Correo inválido" }),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { email } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const getStoredEmail = () => {
    return localStorage.getItem("email");
  };

  const removeStoredEmail = () => {
    localStorage.removeItem("email");
  };

  useEffect(() => {
    const email = getStoredEmail();
    if (email) {
      form.setValue("email", email);
    }
  }, [form]);

  const handleShow = (text: string) => {
    toast.success(text);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/util/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (result.error) {
        setLoading(false);
        handleShow(result.error.message);
        return;
      } else {
        handleShow(result.message);
        removeStoredEmail();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      handleShow("Ocurrió un error inesperado ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            <AnimatedTitle text="Ingresa tu nueva contraseña" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                defaultValue={email || ""}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword" className="mb-2 block">
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="********"
                  {...form.register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block">
                Confirmar nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              Cambiar contraseña
              <SpinnerCustom show={loading} />
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Toaster position="top-center" />
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="mb-2 block text-white">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
