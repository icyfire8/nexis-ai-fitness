import type { Metadata } from "next";
import { Epilogue, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import { AuthProvider } from "../context/AuthContext";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXIS AI Fitness",
  description: "Advanced AI Fitness Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container pb-[100px]">
        <AuthProvider>
          <TopNav />
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
