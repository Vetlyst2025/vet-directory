import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Madison Vet Finder - Find Trusted Madison Vets. Fast.",
  description: "Discover and connect with trusted veterinary clinics in Madison, Wisconsin. Request appointments, read reviews, and find the perfect vet for your pets.",
  keywords: "veterinarian, vet clinic, Madison Wisconsin, pet care, animal hospital",
  openGraph: {
    title: "Madison Vet Finder",
    description: "Find trusted Madison vets. Fast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
