"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import AnimatedTitle from "@/animate/animatedTitle";
import SpinnerCustom from "@/customalert/spinnerCustom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RefreshCw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { countries } from "@/constants/countries";

const FormSchema = z.object({
  countryCode: z.string().nonempty("Selecciona un país"),
  phone: z.string().min(7, { message: "Número inválido" }),
});

export default function ForgotPasswordPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completed, setCompletd] = useState(false);
  const [code, setCode] = useState("");

  const handleSetCode = async () => {
    setCode("");
  };

  const handleChange = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      verifyCode(value);
    }
  };

  const verifyCode = async (otp: string) => {
    const res = await fetch(`${apiUrl}/util/verifyotp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: otp }),
    });

    const result = await res.json();

    if (result.error && result.error.status === 400) {
      handleShow(result.error.message);
    } else {
      if (result.ok == true) {
        router.push("/resetpassword");
        handleShow(result.message);
      }
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      countryCode: "+57",
      phone: "",
    },
  });

  const handleShow = (text: string) => {
    toast.success(text);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const fullPhone = `${data.countryCode}${data.phone}`;

      const res = await fetch(`${apiUrl}/util/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: fullPhone.trim(),
        }),
      });

      const result = await res.json();

      if (result.error && result.error.status === 400) {
        if (result.error.message) {
          setLoading(false);
          handleShow(result.error.message);
        } else {
          setLoading(false);
        }
        return;
      } else {
        setLoading(false);
        setCompletd(true);
        handleShow(result.message);
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
            <AnimatedTitle text="Restablecer contraseña" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Teléfono con selector de país */}
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Número de teléfono
              </Label>
              <div className="flex gap-2">
                <select
                  {...form.register("countryCode")}
                  className="border rounded-md px-2 py-2"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123456789"
                  {...form.register("phone")}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              Enviar
              <SpinnerCustom show={loading}></SpinnerCustom>
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Toaster position="top-center" />
          </div>

          <div className="mt-4 text-center text-sm">
            ¿Nuevo en Vraba?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Crear una cuenta
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
        <CardContent>
          {completed ? (
            <div className="w-full flex justify-center items-center">
              <InputOTP
                pattern={REGEXP_ONLY_DIGITS}
                maxLength={6}
                value={code}
                onChange={handleChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <p className="text-center text-gray-500"></p>
          )}
        </CardContent>
        <CardContent>
          {completed ? (
            <div className="w-full flex justify-center items-center">
              <button
                onClick={handleSetCode}
                className="p-2 bg-white-500 rounded-full hover:bg-gray-600 transition-colors ml-2"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500"></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
