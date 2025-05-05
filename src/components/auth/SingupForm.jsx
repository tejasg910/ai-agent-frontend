"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/api/hooks/auth/singup";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/store/authAtom";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, mutate } = useSignup();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [, setAccessToken] = useAtom(accessTokenAtom);

  const handleSignup = async () => {
    try {
      const response = await mutate({ name, email, password });
console.log(response, "this is response ");
      const token = response.accessToken;
      setAccessToken(token);
      showSuccess("Registration successfull");
      router.push("/dashboard");
    } catch (error) {
      console.log(error, "this is error ");
      showError(error?.response?.data?.message || "Invalid creds");
    }
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-4 border rounded-xl shadow-lg bg-orange-50">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Sign Up</h2>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button
        disabled={isLoading}
        onClick={handleSignup}
        className="bg-orange-500 hover:bg-orange-600 w-full"
      >
        {isLoading ? "Wait" : "Singup"}{" "}
      </Button>
    </div>
  );
}
