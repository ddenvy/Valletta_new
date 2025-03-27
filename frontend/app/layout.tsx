import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Клиентский компонент для инициализации Bootstrap
import ClientBootstrap from '../components/ClientBootstrap';
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valletta CRM",
  description: "Internal CRM system for Valletta Software Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="vh-100 d-flex flex-column">
        <ClientBootstrap />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
