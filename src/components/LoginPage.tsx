import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import triboLogo from "@/assets/tribo-logo.png";

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/webhook-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("tribo_logged_in", "true");
        localStorage.setItem("tribo_user_email", email);
        onLoginSuccess(email);
      } else {
        setError(data.message || "Erro ao fazer login. Tente novamente.");
      }
    } catch (err) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card-tribo w-full max-w-md p-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <img
            src={triboLogo}
            alt="T.R.I.B.O. Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-3xl font-heading text-foreground">
            Acesse seu Gerador de Treinos
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-muted border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-muted border-border text-foreground"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-energy text-white font-semibold py-6 text-lg rounded-xl"
          >
            {isLoading ? "Carregando..." : "ENTRAR NA TRIBO"}
          </Button>
        </form>
      </div>
    </div>
  );
};
