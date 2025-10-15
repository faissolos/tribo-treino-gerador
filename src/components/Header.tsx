import { Button } from "@/components/ui/button";
import { LogOut, User, History } from "lucide-react";
import triboLogo from "@/assets/tribo-logo.png";

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
  onViewHistory?: () => void;
}

export const Header = ({ userEmail, onLogout, onViewHistory }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src={triboLogo} alt="T.R.I.B.O." className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="text-sm font-heading text-foreground">
              T.R.I.B.O. Fitness
            </span>
            <span className="text-xs text-muted-foreground">Gerador de Treinos</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">{userEmail}</span>
          </div>

          {onViewHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewHistory}
              className="text-foreground hover:text-primary hover:bg-muted"
            >
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
