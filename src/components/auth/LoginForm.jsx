"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/api/hooks/auth/login";
import { useToast } from "@/hooks/useToast";
import { ShowerHead } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setAccessToken] = useAtom(accessTokenAtom);

  const { mutate, isLoading, isError } = useLogin();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const handleLogin = async () => {
    try {
      const response = await mutate({ email, password });
      const token = response.accessToken;
      setAccessToken(token);           
      showSuccess("Login success");
      router.push("/dashboard");
    } catch (error) {
      console.log(error, "this si erro ");
      showError(error?.message || "Invalid credentials");
    }
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-4 border rounded-xl shadow-lg bg-orange-50">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Login</h2>
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
        onClick={handleLogin}
        className="bg-orange-500 hover:bg-orange-600 w-full"
      >
        {isLoading ? "Wait " : "Login"}
      </Button>
    </div>
  );
}
