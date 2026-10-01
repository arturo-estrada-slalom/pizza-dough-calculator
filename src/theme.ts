import { createTheme } from "@mui/material/styles";

// Single source of truth for application colors — see docs/COLOR_PALETTE.md.
export const theme = createTheme({
    palette: {
        background: {
            default: "#F5F0E8", // Page background
            paper: "#FFFCF5", // Card / Paper
        },
        primary: {
            main: "#B85C2A", // Primary (terracotta)
            dark: "#9E4D22", // Primary dark (hover state)
        },
        text: {
            primary: "#2C1F14", // High emphasis
            secondary: "#7A6455", // Low emphasis
        },
        divider: "rgba(74,55,40,0.10)", // Divider
    },
});

// Primary tint overlay (docs/COLOR_PALETTE.md "Primary tint"), used for the
// pizza icon/branding treatment behind the emoji.
export const pizzaIconBackground = "rgba(184, 92, 42, 0.12)";
