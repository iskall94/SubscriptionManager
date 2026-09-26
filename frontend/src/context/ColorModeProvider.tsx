import { useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, type PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "../theme";
import { ColorModeContext } from "./useColorMode";

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    return (localStorage.getItem("app_mode") as PaletteMode) || "light";
  });

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("app_mode", next);
          return next;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(() => appTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}