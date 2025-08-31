"use client";

import { CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface animatedTitleCustomProps {
  text: string;
}

export default function AnimatedTitle({ text }: animatedTitleCustomProps) {
  return (
    <CardTitle className="text-center text-2xl font-bold">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05, // Velocidad de aparición
            duration: 0.3,
          }}
        >
          {char}
        </motion.span>
      ))}
    </CardTitle>
  );
}
