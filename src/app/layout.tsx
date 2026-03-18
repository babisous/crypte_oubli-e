import type { Metadata } from "next";
import { Cinzel, Lora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const theQueen = localFont({
  src: "../../public/TheQueen-Regular.ttf",
  variable: "--font-thequeen",
});

export const metadata: Metadata = {
  title: "La Crypte Oubliée — Jeu d'aventure narratif",
  description:
    "Explorez une crypte oubliée, déchiffrez des symboles anciens et découvrez la vérité sur un culte persécuté. Un jeu puzzle-aventure narratif jouable dans votre navigateur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cinzel.variable} ${lora.variable} ${theQueen.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
