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
  const userEmail = localStorage.getItem("tribo_user_email") || "";

  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setWorkoutResult(null);

    try {
      const response = await fetch("/webhook-treino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foco,
          equipamento,
          sexo,
          tempo,
          limitacoes,
        }),
      });

      const data = await response.json();
      setWorkoutResult(data);
    } catch (err) {
      console.error("Error generating workout:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutResult) return;

    try {
      await fetch("/webhook-save-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          workout: workoutResult,
        }),
      });
      alert("Treino salvo com sucesso!");
    } catch (err) {
      console.error("Error saving workout:", err);
      alert("Erro ao salvar treino. Tente novamente.");
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

  return (
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
  );
};
