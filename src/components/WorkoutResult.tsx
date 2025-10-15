import { Button } from "@/components/ui/button";

interface Exercise {
  exercicio: string;
  duracao?: string;
  orientacao: string;
  series?: string;
  repeticoes?: string;
  descanso?: string;
}

interface WorkoutData {
  introducao: {
    mensagem: string;
    foco: string;
  };
  aquecimento: Exercise[];
  treino_principal: Exercise[];
  desaquecimento: Exercise[];
}

interface WorkoutResultProps {
  workout: WorkoutData;
  onSave: () => void;
  onGenerateNew: () => void;
}

export const WorkoutResult = ({ workout, onSave, onGenerateNew }: WorkoutResultProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3 pb-6 border-b border-border">
        <h2 className="text-2xl font-heading text-primary">
          {workout.introducao.foco}
        </h2>
        <p className="text-foreground leading-relaxed">
          {workout.introducao.mensagem}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-heading text-secondary flex items-center gap-2">
          <span className="text-2xl">🔥</span> Aquecimento
        </h3>
        <div className="grid gap-3">
          {workout.aquecimento.map((ex, idx) => (
            <div key={idx} className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{ex.exercicio}</h4>
                {ex.duracao && (
                  <span className="text-sm text-muted-foreground">{ex.duracao}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{ex.orientacao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-heading text-accent flex items-center gap-2">
          <span className="text-2xl">💪</span> Treino Principal
        </h3>
        <div className="grid gap-3">
          {workout.treino_principal.map((ex, idx) => (
            <div key={idx} className="p-4 bg-muted rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">{ex.exercicio}</h4>
              <div className="flex gap-4 mb-2 text-sm">
                {ex.series && (
                  <span className="text-primary font-semibold">
                    {ex.series} séries
                  </span>
                )}
                {ex.repeticoes && (
                  <span className="text-secondary font-semibold">
                    {ex.repeticoes} reps
                  </span>
                )}
                {ex.descanso && (
                  <span className="text-muted-foreground">
                    Descanso: {ex.descanso}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{ex.orientacao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-heading text-secondary flex items-center gap-2">
          <span className="text-2xl">🧘</span> Desaquecimento
        </h3>
        <div className="grid gap-3">
          {workout.desaquecimento.map((ex, idx) => (
            <div key={idx} className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{ex.exercicio}</h4>
                {ex.duracao && (
                  <span className="text-sm text-muted-foreground">{ex.duracao}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{ex.orientacao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-border">
        <Button
          onClick={onSave}
          className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-semibold py-6 rounded-xl"
        >
          Salvar este Treino
        </Button>
        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-6 rounded-xl"
        >
          Gerar Novo Treino
        </Button>
      </div>
    </div>
  );
};
