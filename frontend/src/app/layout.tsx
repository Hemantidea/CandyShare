import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CandyShare | Simply Sweet P2P Sharing",
  description: "Secure, direct peer-to-peer file sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <Navbar />
          {/* Main content expands to fill space between nav and footer */}
          <main className="flex-grow flex flex-col items-center justify-center w-full px-4">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}