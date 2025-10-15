import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, X } from "lucide-react";
import { WEBHOOKS, WEBHOOK_TAGS } from "@/config/webhooks";
import { getErrorMessage } from "@/utils/errorMessages";
import { toast } from "sonner";
import { WorkoutResult } from "./WorkoutResult";

interface SavedWorkout {
  id: string;
  date: string;
  foco: string;
  workout: any;
}

interface WorkoutHistoryProps {
  userEmail: string;
  onClose: () => void;
}

export const WorkoutHistory = ({ userEmail, onClose }: WorkoutHistoryProps) => {
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<SavedWorkout | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(WEBHOOKS.GET_WORKOUTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tag: WEBHOOK_TAGS.GET_WORKOUTS,
          email: userEmail 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts || []);
      } else {
        const errorMsg = getErrorMessage(response.status);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
      toast.error("Erro de conexão ao carregar treinos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (workoutId: string) => {
    try {
      const response = await fetch(WEBHOOKS.DELETE_WORKOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tag: WEBHOOK_TAGS.DELETE_WORKOUT,
          email: userEmail, 
          workoutId 
        }),
      });

      if (response.ok) {
        toast.success("Treino deletado com sucesso!");
        setWorkouts(workouts.filter((w) => w.id !== workoutId));
      } else {
        const errorMsg = getErrorMessage(response.status);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Erro ao deletar treino:", error);
      toast.error("Erro de conexão ao deletar treino");
    }
  };

  if (selectedWorkout) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading text-foreground">
              Treino de {new Date(selectedWorkout.date).toLocaleDateString()}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedWorkout(null)}
            >
              <X className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="card-tribo p-8">
            <WorkoutResult
              workout={selectedWorkout.workout}
              onSave={() => {}}
              onGenerateNew={() => setSelectedWorkout(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-heading text-foreground">
            Histórico de Treinos
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>

        {isLoading ? (
          <div className="card-tribo p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando treinos...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="card-tribo p-8 text-center">
            <p className="text-muted-foreground">
              Você ainda não tem treinos salvos. Gere seu primeiro treino!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="card-tribo p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-heading text-lg text-foreground mb-1">
                    {workout.foco}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workout.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWorkout(workout)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(workout.id)}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
