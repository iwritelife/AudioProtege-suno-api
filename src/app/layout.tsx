import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tune Gawd - AI Music Studio",
  description: "Create professional music with AI. Transform your ideas into hits with Tune Gawd's advanced music generation platform.",
  keywords: ["tune gawd", "ai music", "music generation", "ai studio", "create music", "music ai", "song generator"],
  creator: "Tune Gawd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-y-scroll`} >
        <Header />
        <main className="flex flex-col items-center m-auto w-full">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
