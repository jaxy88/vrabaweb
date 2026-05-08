"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Music } from "lucide-react"; // Importamos icono de música

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

  const onSubmit = async (
  data: z.infer<typeof FormSchema>
) => {
  setLoading(true);

  setEmail(inputEmail);

  try {
    const res = await fetch(
      `${apiUrl}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }
    );

    const result = await res.json();

    if (
      result.error &&
      result.error.status === 400
    ) {
      setOpen(true);

      setLoading(false);

      return;
    }

    // useAuthStore.getState().setAuth({
    //   token: result.token,

    //   role: result.role,

    //   tenantId: result.tenant_id,

    //   user: result.user,
    // });

    router.push("/dashboard");
  } catch (error) {
    setLoading(false);

    toast.error(
      "Ocurrió un error inesperado ❌"
    );
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* FONDO MUSICAL CON IA: Ondas de sonido y red neuronal */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          {/* Ondas de sonido estilizadas */}
          <path
            d="M0,500 C100,450 200,550 300,500 C400,450 500,550 600,500 C700,450 800,550 900,500 C1000,450 1000,500 1000,500 L1000,1000 L0,1000 Z"
            fill="#8b5cf6"
            className="animate-pulse"
          />
          <path
            d="M0,600 C100,550 200,650 300,600 C400,550 500,650 600,600 C700,550 800,650 900,600 C1000,550 1000,600 1000,600 L1000,1000 L0,1000 Z"
            fill="#a78bfa"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
        {/* Red neuronal abstracta superpuesta */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-color-dodge opacity-20" />
      </div>

      {/* Overlay oscuro para contraste del formulario */}
      <div className="absolute inset-0 z-5 bg-slate-950/70" />

      {/* Tarjeta con efecto Glassmorphism */}
      <Card className="relative z-10 w-full max-w-[420px] shadow-2xl border-white/5 bg-slate-900/90 backdrop-blur-lg">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-2 items-center gap-2">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <Music className="text-primary" size={20} />
            <div className="h-1 w-12 bg-primary rounded-full" />
          </div>
          <CardTitle className="text-center text-3xl font-extrabold tracking-tight text-white">
            <AnimatedTitle text="Bienvenido web master" />
          </CardTitle>
          <p className="text-center text-sm text-slate-300 font-medium">
            AI Music Platform Administration
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200 font-semibold">
                Correo electrónico
              </Label>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@musicplatform.ai"
                    className="h-11 bg-slate-800 border-slate-700 text-white focus:ring-primary focus:border-primary"
                    value={inputEmail}
                    onChange={(e) => {
                      setInputEmail(e.target.value);
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-xs font-bold animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label
                htmlFor="password"
                className="text-slate-200 font-semibold"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pr-11 bg-slate-800 border-slate-700 text-white focus:ring-primary focus:border-primary"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-destructive text-xs font-bold animate-in fade-in slide-in-from-top-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] bg-primary text-white"
              disabled={loading}
            >
              {!loading && "Acceder al Panel Musical"}
              <SpinnerCustom show={loading}></SpinnerCustom>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center space-y-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span>AI Music Master v2.0</span>
          </div>

          <CustomAlertDialog
            show={open}
            onOpenChange={setOpen}
            title="Acceso Denegado"
            description="Las credenciales no coinciden con nuestros registros de seguridad musical."
            cancelText="Intentar de nuevo"
          />
        </CardContent>
      </Card>
    </div>
  );
}