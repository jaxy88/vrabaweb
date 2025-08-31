"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import SpinnerCustom from "@/customalert/spinnerCustom";
import { CustomAlertDialog } from "@/customalert/alertDialog";
import AnimatedTitle from "@/animate/animatedTitle";
import { useAuth } from "@/context/authContext";

const FormSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

export default function LoginPage() {
  const { setEmail } = useAuth();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [inputEmail, setInputEmail] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getEmail = () => {
    //setEmail(inputEmail);
    localStorage.setItem("email", inputEmail);
    router.push("/forgot-password");
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setEmail(inputEmail);
    try {
      const res = await fetch(`${apiUrl}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (result.error && result.error.status === 400) {
        setOpen(true);
        setLoading(false);
        return;
      } else {
        const response = NextResponse.json({ user: result.user });
        response.cookies.set("token", result.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60,
        });

        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Ocurrió un error inesperado ❌ " + error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* 🔒 Login centrado */}
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              <AnimatedTitle text="Bienvenido a Vraba" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Correo electrónico
                </Label>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={inputEmail}
                      onChange={(e) => {
                        setInputEmail(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="password" className="mb-2 block">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...form.register("password")}
                  className="pr-10" // deja espacio para el ícono
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-9 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Iniciar sesión
                <SpinnerCustom show={loading}></SpinnerCustom>
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <CustomAlertDialog
                show={open}
                onOpenChange={setOpen}
                title="Verifica tu correo y contraseña"
                description="¡Por favor ingresa las credenciales correctas, en caso de no poder ingresar cambia tu contraseña o comunícate con soporte!"
                cancelText="Cerrar"
              />
            </div>

            <div className="mt-4 text-center text-sm">
              <button
                onClick={getEmail}
                className="text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="mt-2 text-center text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Crear cuenta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
