import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linho Holdings | Inteligência e crescimento",
  description: "Plataforma de produtos digitais e gestão de resultados da Linho Holdings."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
