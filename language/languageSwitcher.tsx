"use client";

import { useRouter } from "next/router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  const handleChange = (lng: string) => {
    router.push(asPath, asPath, { locale: lng });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 border px-3 py-2 rounded-md">
          <Globe className="w-4 h-4" />
          <span className="uppercase">{locale}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white border rounded-md shadow-md p-2"
        align="end"
      >
        {languages.map((lng) => (
          <DropdownMenu.Item
            key={lng.code}
            onClick={() => handleChange(lng.code)}
            className={`px-3 py-1 rounded cursor-pointer ${
              locale === lng.code ? "font-bold text-blue-600" : "text-gray-800"
            }`}
          >
            {lng.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
