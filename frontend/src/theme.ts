import { createTheme, type PaletteMode } from "@mui/material/styles";

export const appTheme = ( mode: PaletteMode) =>
	createTheme({
		palette: {
      mode,
      ...(mode === "light"
        ? {
						// Light Mode:
            primary: {
              main: "#0284c7",
              contrastText: "#ffffff",
            },
            background: {
              default: "#f8fafc",
              paper: "#ffffff",
            },
            text: {
              primary: "#0f172a",
              secondary: "#64748b",
            },
            divider: "#e2e8f0",
          }
        : {
            // Dark Mode:
            primary: {
              main: "#38bdf8",
              contrastText: "#0b0f19",
            },
            background: {
              default: "#0b0f19",
              paper: "#111827",
            },
            text: {
              primary: "#f8fafc",
              secondary: "#94a3b8",
            },
            divider: "#1f2937",
          }),
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
		components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*, *::before, *::after": {
            transition: "background-color 0.25s ease, color 0.2s ease, border-color 0.25s ease !important",
          },
        },
      },
    },
});	