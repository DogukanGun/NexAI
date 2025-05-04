"use client"
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar onLaunchClick={() => setIsModalOpen(true)} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
} 