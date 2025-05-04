"use client";
import { useRouter } from "next/navigation";
import React from "react";

const GetStarted = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/login")}
      className="relative cursor-pointer overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold text-lg transform transition-transform hover:scale-105 hover:shadow-lg  group"
    >
      Get Started Now
      <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0  transition-opacity duration-300" />
      <span className="relative">→</span>
    </button>
  );
};

export default GetStarted;
