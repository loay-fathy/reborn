"use client";
import { ArrowDown, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      window.location.href = "/chasier";
    } catch (error) {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <section className="p-24 pt-0">
      <div className="rounded-b-[60px] overflow-hidden shadow-2xl flex bg-background">
        <div className="w-1/2">
          <Image
            src="/images/b87931cd3eb82083081235d1f2b8fa6af54fb897.jpg"
            alt="login image"
            width={580}
            height={550}
            className="w-full aspect-6/5"
          />
          <Image
            src="/images/800773d1f59b72b4ff320a46b6963bdfd0cc1066.png"
            alt="login image"
            width={580}
            height={550}
            className="bg-[#DFD6C5] w-full aspect-6/5"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center p-24">
          <h1 className="text-5xl font-bold mb-3">Welcome to KKP</h1>
          <p className="text-xl">Enter you details</p>
          <form
            className="flex flex-col gap-8 w-full mt-9"
            onSubmit={handleLogin}
          >
            <div className="bg-white border-2 border-main-color rounded-2xl flex items-center">
              <input
                type="text"
                placeholder="Username"
                name="username"
                className="border-none h-10 outline-none w-full px-4 rounded-2xl"
              />
              <button className="cursor-pointer">
                <ArrowDown className="text-main-color w-20 h-11 p-2.5 bg-white border-l-[3] border-[#E8E8E8] rounded-2xl" />
              </button>
            </div>
            <div className="bg-white border-2 border-main-color rounded-2xl flex items-center">
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="border-none h-10 outline-none w-full px-4 rounded-2xl"
              />
              <button className="cursor-pointer">
                <LockKeyhole className="text-main-color w-20 h-11 p-2.5 bg-white border-l-[3] border-[#E8E8E8] rounded-2xl" />
              </button>
            </div>
            <button
              className="bg-main-color text-white font-bold py-3 rounded-2xl cursor-pointer w-3/5 mx-auto"
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
