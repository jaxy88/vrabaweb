"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDialogProps {
  triggerText?: string;
  show?: boolean; // 👈 controlar visibilidad
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function CustomAlertDialog({
  triggerText = "",
  show = false,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onOpenChange,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={show} onOpenChange={onOpenChange}>
      {/* Trigger opcional */}
      {triggerText && (
        <AlertDialogTrigger asChild>
          <Button variant="outline">{triggerText}</Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="rounded-2xl shadow-xl">
        <AlertDialogHeader>
          {title && (
            <AlertDialogTitle className="text-lg font-bold">
              {title}
            </AlertDialogTitle>
          )}
          {description && (
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel onClick={onCancel} className="rounded-xl">
            {cancelText}
          </AlertDialogCancel>

          {confirmText && (
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
