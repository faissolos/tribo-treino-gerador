import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import triboLogo from "@/assets/tribo-logo.png";
import { loginSchema } from "@/schemas/login.schema";
import { WEBHOOKS, DEV_MODE, DEV_CREDENTIALS } from "@/config/webhooks";
import { getErrorMessage } from "@/utils/errorMessages";
import { toast } from "sonner";

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

    // Validação com Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      setError(firstError);
      toast.error(firstError);
      return;
    }

    setIsLoading(true);

    try {
      // Modo de desenvolvimento - bypass do webhook
      if (DEV_MODE && email === DEV_CREDENTIALS.email && password === DEV_CREDENTIALS.password) {
        toast.success("Login bem-sucedido! (Modo desenvolvimento)");
        onLoginSuccess(email);
        return;
      }

      // Timeout de 15 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(WEBHOOKS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMsg = getErrorMessage(response.status);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Login bem-sucedido!");
        onLoginSuccess(email);
      } else {
        const errorMsg = data.message || "Erro ao fazer login. Tente novamente.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      let errorMsg = "Erro de conexão. Verifique sua internet e tente novamente.";
      
      if (err.name === "AbortError") {
        errorMsg = "Requisição demorou muito. Tente novamente.";
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
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

          {DEV_MODE && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              Modo desenvolvimento: use <span className="text-primary font-semibold">{DEV_CREDENTIALS.email}</span> / <span className="text-primary font-semibold">{DEV_CREDENTIALS.password}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
