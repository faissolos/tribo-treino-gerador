import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutResult } from "./WorkoutResult";
import { Header } from "./Header";
import { WorkoutHistory } from "./WorkoutHistory";
import { workoutSchema } from "@/schemas/workout.schema";
import { WEBHOOKS, WEBHOOK_TAGS } from "@/config/webhooks";
import { getErrorMessage } from "@/utils/errorMessages";
import { WORKOUT_GENERATION_PROMPT, WORKOUT_VALIDATION_ERROR } from "@/utils/aiPrompts";
import { toast } from "sonner";

interface WorkoutData {
  introducao: {
    mensagem: string;
    foco: string;
  };
  aquecimento: Array<{
    exercicio: string;
    duracao: string;
    orientacao: string;
  }>;
  treino_principal: Array<{
    exercicio: string;
    series: string;
    repeticoes: string;
    descanso: string;
    orientacao: string;
  }>;
  desaquecimento: Array<{
    exercicio: string;
    duracao: string;
    orientacao: string;
  }>;
}

export const WorkoutGenerator = () => {
  const [foco, setFoco] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [sexo, setSexo] = useState("");
  const [tempo, setTempo] = useState("");
  const [limitacoes, setLimitacoes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutResult, setWorkoutResult] = useState<WorkoutData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const userEmail = localStorage.getItem("tribo_user_email") || "";

  const handleLogout = () => {
    localStorage.removeItem("tribo_logged_in");
    localStorage.removeItem("tribo_user_email");
    window.location.reload();
  };

  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação com Zod
    const validation = workoutSchema.safeParse({
      foco,
      equipamento,
      sexo,
      tempo,
      limitacoes,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      toast.error(firstError);
      return;
    }

    setIsGenerating(true);
    setWorkoutResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s para geração

      // Gera o prompt completo para a IA
      const prompt = WORKOUT_GENERATION_PROMPT({
        foco,
        equipamento,
        sexo,
        tempo,
        limitacoes,
      });

      const response = await fetch(WEBHOOKS.GENERATE_WORKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: WEBHOOK_TAGS.GENERATE_WORKOUT,
          prompt,
          foco,
          equipamento,
          sexo,
          tempo,
          limitacoes,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMsg = getErrorMessage(response.status);
        toast.error(errorMsg);
        return;
      }

      const data = await response.json();
      
      // Valida se o JSON retornado tem a estrutura esperada
      if (!data.introducao || !data.aquecimento || !data.treino_principal || !data.desaquecimento) {
        console.error("Resposta da IA em formato inválido:", data);
        toast.error(WORKOUT_VALIDATION_ERROR.message);
        return;
      }

      setWorkoutResult(data);
      toast.success("Treino gerado com sucesso! ✨");
    } catch (err: any) {
      if (err.name === "AbortError") {
        toast.error("A geração está demorando muito. Tente novamente.");
      } else {
        console.error("Erro ao gerar treino:", err);
        toast.error("Erro ao gerar treino. Tente novamente.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutResult) return;

    try {
      const response = await fetch(WEBHOOKS.SAVE_WORKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: WEBHOOK_TAGS.SAVE_WORKOUT,
          email: userEmail,
          workout: workoutResult,
          foco,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Treino salvo com sucesso! 🎉");
      } else {
        const errorMsg = getErrorMessage(response.status);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Erro ao salvar treino:", err);
      toast.error("Erro de conexão ao salvar treino.");
    }
  };

  const handleGenerateNew = () => {
    setWorkoutResult(null);
    setFoco("");
    setEquipamento("");
    setSexo("");
    setTempo("");
    setLimitacoes("");
  };

  if (showHistory) {
    return (
      <>
        <Header
          userEmail={userEmail}
          onLogout={handleLogout}
          onViewHistory={() => setShowHistory(false)}
        />
        <WorkoutHistory
          userEmail={userEmail}
          onClose={() => setShowHistory(false)}
        />
      </>
    );
  }

  return (
    <>
      <Header
        userEmail={userEmail}
        onLogout={handleLogout}
        onViewHistory={() => setShowHistory(true)}
      />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-heading text-foreground">
            Gerador de Treino com Método V.I.D.A.
          </h1>
          <p className="text-muted-foreground">
            Personalize seu treino de acordo com suas necessidades
          </p>
        </div>

        <div className="card-tribo p-8 animate-fade-in">
          <form onSubmit={handleGenerateWorkout} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="foco" className="text-foreground">
                  Foco do Treino <span className="text-primary">*</span>
                </Label>
                <Input
                  id="foco"
                  placeholder="Ex: Perda de peso, ganho de massa..."
                  value={foco}
                  onChange={(e) => setFoco(e.target.value)}
                  required
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipamento" className="text-foreground">
                  Equipamento <span className="text-primary">*</span>
                </Label>
                <Input
                  id="equipamento"
                  placeholder="Ex: Academia completa, casa..."
                  value={equipamento}
                  onChange={(e) => setEquipamento(e.target.value)}
                  required
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo" className="text-foreground">
                  Sexo
                </Label>
                <Select value={sexo} onValueChange={setSexo}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="prefiro-nao-informar">
                      Prefiro não informar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempo" className="text-foreground">
                  Tempo Disponível (minutos)
                </Label>
                <Input
                  id="tempo"
                  type="number"
                  placeholder="Ex: 45"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitacoes" className="text-foreground">
                Limitações ou Lesões
              </Label>
              <Textarea
                id="limitacoes"
                placeholder="Descreva qualquer limitação física ou lesão (opcional)"
                value={limitacoes}
                onChange={(e) => setLimitacoes(e.target.value)}
                className="bg-muted border-border text-foreground min-h-24"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-vitality text-white font-semibold py-6 text-lg rounded-xl"
            >
              {isGenerating ? "Gerando seu plano... Por favor, aguarde." : "GERAR MEU TREINO ✨"}
            </Button>
          </form>
        </div>

        <div className="card-tribo p-8 min-h-[200px]">
          {workoutResult ? (
            <WorkoutResult
              workout={workoutResult}
              onSave={handleSaveWorkout}
              onGenerateNew={handleGenerateNew}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p>Gerando seu treino personalizado...</p>
                </div>
              ) : (
                "Seu treino personalizado aparecerá aqui..."
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};
