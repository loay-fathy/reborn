"use client";
import { ArrowDown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { setAuthData } from "@/lib/auth";
import { motion } from "motion/react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const loginData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        setError("Nom d'utilisateur ou mot de passe invalide");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAuthData(data);

      setLoading(false);
      window.location.href = "/cashier";
    } catch (error) {
      setError("Erreur réseau");
      setLoading(false);
    }
  }

  return (
    <section className="h-screen w-full p-12 pt-0 lg:p-24 lg:pt-0 overflow-hidden">
      <div className="h-full w-full rounded-b-[60px] overflow-hidden shadow-2xl flex bg-background">
        <div className="w-1/2 h-full flex flex-col">
          <div className="relative flex-1 w-full">
            <Image
              src="/images/b87931cd3eb82083081235d1f2b8fa6af54fb897.jpg"
              alt="login image"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative flex-1 w-full bg-[#DFD6C5]">
            <Image
              src="/images/800773d1f59b72b4ff320a46b6963bdfd0cc1066.png"
              alt="login image"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-center p-12 lg:p-24 lg:px-20">
          <h1 className="text-4xl xl:text-5xl font-bold mb-3">Bienvenue à KKL</h1>
          <p className="text-lg lg:text-xl text-gray-500">Entrez vos identifiants</p>
          <form
            className="flex flex-col gap-8 w-full mt-9 max-w-md"
            onSubmit={handleLogin}
          >
            <motion.div className="relative bg-white border-2 border-main-color rounded-2xl flex items-center">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                name="username"
                className="border-none h-12 outline-none w-full px-4 text-lg rounded-2xl"
              />
              <button className="cursor-pointer h-12 w-16 flex items-center justify-center bg-white border-l-[3px] border-[#E8E8E8] rounded-2xl">
                <ArrowDown className="text-main-color w-6 h-6" />
              </button>
            </motion.div>
            <div className="relative bg-white border-2 border-main-color rounded-2xl flex items-center">
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                className="border-none h-12 outline-none w-full px-4 text-lg rounded-2xl"
              />
              <button className="cursor-pointer h-12 w-16 flex items-center justify-center bg-white border-l-[3px] border-[#E8E8E8] rounded-2xl">
                <LockKeyhole className="text-main-color w-6 h-6" />
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center font-semibold">{error}</p>
            )}
            <button
              className="bg-main-color text-white font-bold py-3 rounded-2xl cursor-pointer w-3/5 mx-auto hover:bg-main-color/90 transition-colors"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
