import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image from "next/image";
import React from "react";

interface SwitchLanguageProps {
  className?: ClassValue;
  // currentLanguage: 'vi' | 'en';
}

export const SwitchLanguage: React.FC<SwitchLanguageProps> = ({
  className,
}) => {
  const cookieStore = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  const changeLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/;`;

    window.location.reload();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div
        className={
          "w-6 h-6 rounded-full relative overflow-hidden cursor-pointer"
        }
      >
        {cookieStore === "vi" ? (
          <Image
            src="https://flagcdn.com/us.svg"
            alt="Vietnamese flag"
            fill
            className="object-cover"
            onClick={() => changeLanguage("en")}
          />
        ) : (
          <Image
            src="https://flagcdn.com/vn.svg"
            alt="American flag"
            fill
            className="object-cover"
            onClick={() => changeLanguage("vi")}
          />
        )}
      </div>
    </div>
  );
};
