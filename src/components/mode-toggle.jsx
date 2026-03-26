import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;
        return (
          <Button
            key={t.name}
            variant="ghost"
            size="icon"
            onClick={() => setTheme(t.name)}
            className={`h-8 w-8 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Icon
              className="h-[18px] w-[18px]"
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="sr-only">{t.label} mode</span>
          </Button>
        );
      })}
    </div>
  );
}
