"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import AnimatedTitle from "@/animate/animatedTitle";

import { useState } from "react";
import { CustomAlertDialog } from "@/customalert/alertDialog";
import SpinnerCustom from "@/customalert/spinnerCustom";
import { generateUsername } from "@/utils/generateUsername";

const FormSchema = z.object({
  company: z
    .string()
    .min(2, { message: "El nombre de la empresa es obligatorio" }),
  website: z
    .string()
    .url({ message: "Debe ser una URL válida" })
    .optional()
    .or(z.literal("")), // permite vacío
  email: z.string().email({ message: "Correo inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function RegisterPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setShowToaster] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: "",
      website: "",
      email: "",
      password: "",
    },
  });

  const handleShow = (text: string) => {
    toast.success(text);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: generateUsername(data.company),
          company: data.company,
          website: data.website,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();
      if (result.error && result.error.status === 400) {
        if (result.error.message) {
          setLoading(false);
          handleShow(result.error.message);
        } else {
          setOpen(true);
          setLoading(false);
        }
        return;
      } else {
        setShowToaster(true);
        setLoading(false);
        handleShow("¡Tu cuenta ha sido registrada satisfactoriamente!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Ocurrió un error inesperado ❌ " + error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            <AnimatedTitle text="Comienza gratis" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="company" className="mb-2 block">
                Nombre de la empresa
              </Label>
              <Input
                id="company"
                placeholder="ACME Inc"
                {...form.register("company")}
              />
              {form.formState.errors.company && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="website" className="mb-2 block">
                Sitio web
              </Label>
              <Input
                id="website"
                placeholder="https://example.com"
                {...form.register("website")}
              />
              {form.formState.errors.website && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Registrarse
              <SpinnerCustom show={loading}></SpinnerCustom>
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <CustomAlertDialog
              show={open}
              onOpenChange={setOpen}
              title="Ocurrio un error al registrar tu cuenta"
              description="¡En caso de que el error persista o continue, comunícate con soporte!"
              cancelText="Cerrar"
            />
          </div>

          <div className="mt-4 text-center text-sm">
            <Toaster position="top-center" />
          </div>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
