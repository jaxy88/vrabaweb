"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlertErrorCustomAnimatedProps {
  open: boolean;
  title: string;
  description?: string;
  items?: string[];
  onClose?: () => void;
}

export default function AlertErrorCustomAnimated({
  open,
  title,
  description,
  items,
  onClose,
}: AlertErrorCustomAnimatedProps) {
  return (
    <div className="w-full flex">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-md"
            role="status"
          >
            <Alert variant="destructive" className="shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircleIcon className="mt-1 h-5 w-5 flex-shrink-0" />
                <div className="font-semibold text-sm leading-snug whitespace-normal break-words">
                  {title}
                </div>

                <AlertDescription className="mt-1 text-sm whitespace-normal break-words">
                  {description && <p className="mb-2">{description}</p>}
                  {items && items.length > 0 && (
                    <ul className="list-inside list-disc text-sm pl-4">
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>

                {onClose && (
                  <button
                    aria-label="Cerrar alerta"
                    onClick={onClose}
                    className="ml-2 rounded-md px-2 py-1 text-sm opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
